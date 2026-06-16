// ─────────────────────────────────────────────────────────────
// intake.js — Golden State Rehab intake/VOB form client logic
// ─────────────────────────────────────────────────────────────
//   • Drag & drop + file preview
//   • Client-side image compression (Canvas → JPEG)
//   • Validation
//   • Multipart submit to /api/send-vob
//   • Loading + error states
//   • Redirect to /intake-success on success
//
// HIPAA: this script never logs PHI. The only console output is
// non-PHI status (compression ratios, submit start/end, errors).
// ─────────────────────────────────────────────────────────────

(function () {
  'use strict';

  const ENDPOINT = '/api/send-vob';
  const SUCCESS_URL = (document.documentElement.lang === 'es') ? '/es/intake-success' : '/intake-success';

  // Per-file caps the server also enforces
  const MAX_FILE_BYTES = 10 * 1024 * 1024;   // 10 MB
  const MAX_TOTAL_BYTES = 4 * 1024 * 1024;   // 4 MB — stays under Vercel's body limit after compression
  const ALLOWED_EXT = /\.(jpe?g|png|heic|heif|pdf)$/i;
  const ALLOWED_MIME = new Set([
    'image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif', 'application/pdf',
  ]);

  // Image compression target
  const COMPRESS_MAX_DIMENSION = 1800; // px, longest edge
  const COMPRESS_QUALITY = 0.85;       // JPEG quality
  const COMPRESS_TYPE = 'image/jpeg';

  // ─── State ──────────────────────────────────────────────────
  /** Map<fieldName, Array<File>> — files selected by the user (post-compression) */
  const selected = new Map();

  // ─── DOM ────────────────────────────────────────────────────
  const form = document.getElementById('intake-form');
  if (!form) return;

  const submitBtn = document.getElementById('intake-submit');
  const submitLabel = submitBtn.querySelector('.intake-submit-label');
  const submitLoading = submitBtn.querySelector('.intake-submit-loading');
  const errorBanner = document.getElementById('intake-error');
  const errorText = document.getElementById('intake-error-text');

  // ─── Custom dropdowns (insurance + state) ───────────────────
  const US_STATES = [
    ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],
    ['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['DC','District of Columbia'],
    ['FL','Florida'],['GA','Georgia'],['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],
    ['IN','Indiana'],['IA','Iowa'],['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],
    ['ME','Maine'],['MD','Maryland'],['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],
    ['MS','Mississippi'],['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],
    ['NH','New Hampshire'],['NJ','New Jersey'],['NM','New Mexico'],['NY','New York'],
    ['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],['OK','Oklahoma'],['OR','Oregon'],
    ['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],['SD','South Dakota'],
    ['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],['VA','Virginia'],
    ['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming'],
  ];

  // Insurance carriers — keeps CRM values consistent, but free typing is allowed.
  const INSURERS = [
    'Aetna','Anthem Blue Cross','Blue Cross Blue Shield (out-of-state)','Blue Shield of California',
    'Cigna','Health Net','Humana','Kaiser Permanente','Magellan Healthcare','UnitedHealthcare (UHC)',
    'Ambetter','Beacon Health Options / Carelon','Centene','ComPsych','First Health Network','GEHA',
    'Independence Blue Cross','MHN (Managed Health Network)','Molina Healthcare','MultiPlan / PHCS',
    'Optum Behavioral Health','Oscar Health','Sutter Health Plus','TRICARE','UMR',
    'Self-Pay / No Insurance','Not Sure',
  ];

  // Attribution — "How did you hear about us?"
  const REFERRAL_SOURCES = [
    'Google Search','Google Maps','Friend or Family','Doctor or Therapist Referral',
    'Insurance Provider','Facebook or Instagram','TikTok','Saw an Ad','Alumni / Past Client',
    'Psychology Today','Other',
  ];

  let openSelect = null;
  document.querySelectorAll('.intake-select').forEach(initSelect);
  document.addEventListener('click', (e) => {
    if (openSelect && !openSelect.contains(e.target)) closeSelect(openSelect);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && openSelect) closeSelect(openSelect);
  });

  function initSelect(root) {
    const input = root.querySelector('.intake-select-input');
    const panel = root.querySelector('.intake-select-panel');
    if (!input || !panel) return;
    let options;
    if (root.dataset.options === 'states') options = US_STATES.map(([code, label]) => ({ value: code, label }));
    else if (root.dataset.options === 'insurers') options = INSURERS.map((v) => ({ value: v, label: v }));
    else if (root.dataset.options === 'referral') options = REFERRAL_SOURCES.map((v) => ({ value: v, label: v }));
    else options = [];
    const freetext = root.dataset.freetext === 'true';
    root._freetext = freetext;
    renderOptions(panel, options);

    input.addEventListener('focus', () => {
      if (openSelect && openSelect !== root) closeSelect(openSelect);
      openSelectPanel(root);
      input.select();
    });
    input.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!root.classList.contains('is-open')) openSelectPanel(root);
    });
    input.addEventListener('input', () => {
      // Free-text mode: capture whatever the user types live (CRM still gets a value
      // even if it isn't in the list).
      if (freetext) {
        const h = document.getElementById(root.dataset.select);
        if (h) h.value = input.value.trim();
        hideError();
      }
      const q = input.value.trim().toLowerCase();
      const filtered = q
        ? options.filter((o) => o.label.toLowerCase().includes(q))
        : options;
      renderOptions(panel, filtered);
      if (!root.classList.contains('is-open')) openSelectPanel(root);
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const first = panel.querySelector('.intake-select-option');
        if (first) {
          commitOption(root, first.dataset.value, first.dataset.label);
          closeSelect(root);
          input.blur();
        }
      } else if (e.key === 'Escape') {
        closeSelect(root);
        input.blur();
      }
    });
    panel.addEventListener('click', (e) => {
      const opt = e.target.closest('.intake-select-option');
      if (!opt) return;
      e.preventDefault();
      e.stopPropagation();
      commitOption(root, opt.dataset.value, opt.dataset.label);
      closeSelect(root);
    });

    root._allOptions = options;
  }
  function renderOptions(panel, options) {
    if (!options.length) {
      panel.innerHTML = '<div class="intake-select-empty">' + (document.documentElement.lang === "es" ? "Sin resultados" : "No matches") + '</div>';
      return;
    }
    panel.innerHTML = options.map((o) =>
      `<button type="button" class="intake-select-option" data-value="${escAttr(o.value)}" data-label="${escAttr(o.label)}" role="option">${escAttr(o.label)}</button>`
    ).join('');
  }
  function escAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function openSelectPanel(root) {
    root.classList.add('is-open');
    root.querySelector('.intake-select-input').setAttribute('aria-expanded', 'true');
    openSelect = root;
  }
  function closeSelect(root) {
    root.classList.remove('is-open');
    const input = root.querySelector('.intake-select-input');
    const panel = root.querySelector('.intake-select-panel');
    const hidden = document.getElementById(root.dataset.select);
    input.setAttribute('aria-expanded', 'false');
    const opts = root._allOptions || [];
    if (root._freetext) {
      // Keep exactly what the user typed or picked — don't snap back to a list value.
      if (hidden) hidden.value = input.value.trim();
    } else {
      const committed = hidden.value
        ? opts.find((o) => o.value === hidden.value)
        : null;
      input.value = committed ? committed.label : '';
    }
    renderOptions(panel, opts);
    if (openSelect === root) openSelect = null;
  }
  function commitOption(root, value, label) {
    const input = root.querySelector('.intake-select-input');
    const hidden = document.getElementById(root.dataset.select);
    input.value = label;
    hidden.value = value;
    hideError();
  }

  // ─── Phone auto-format: (xxx) xxx-xxxx ──────────────────────
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      const el = e.target;
      const cursorStart = el.selectionStart || 0;
      const digitsBeforeCursor = (el.value.slice(0, cursorStart).match(/\d/g) || []).length;
      let digits = el.value.replace(/\D/g, '');
      if (digits.length === 11 && digits[0] === '1') digits = digits.slice(1);
      digits = digits.slice(0, 10);
      let formatted = '';
      if (digits.length === 0) formatted = '';
      else if (digits.length <= 3) formatted = digits;
      else if (digits.length <= 6) formatted = `(${digits.slice(0,3)}) ${digits.slice(3)}`;
      else formatted = `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
      el.value = formatted;
      let newCursor = 0, dc = 0;
      for (let i = 0; i < formatted.length; i++) {
        newCursor = i + 1;
        if (/\d/.test(formatted[i])) dc++;
        if (dc >= digitsBeforeCursor) break;
      }
      if (digitsBeforeCursor === 0) newCursor = 0;
      try { el.setSelectionRange(newCursor, newCursor); } catch (_e) {}
    });
  }

  // ─── Wire up dropzones ──────────────────────────────────────
  document.querySelectorAll('.intake-dropzone').forEach(initDropzone);

  function initDropzone(zone) {
    const input = zone.querySelector('input[type="file"]');
    const field = zone.dataset.field;
    const multiple = zone.dataset.multiple === 'true';
    selected.set(field, []);

    input.addEventListener('change', () => {
      handleFiles(field, Array.from(input.files), multiple, zone);
      // Clear native input so the user can re-select the same file after removal
      input.value = '';
    });

    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('is-dragover');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('is-dragover'));
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('is-dragover');
      const files = Array.from(e.dataTransfer.files || []);
      handleFiles(field, files, multiple, zone);
    });
  }

  async function handleFiles(field, files, multiple, zone) {
    hideError();
    if (!files.length) return;

    const current = selected.get(field);
    const accepted = multiple ? [...current] : [];

    for (const f of files) {
      if (!isAllowedFile(f)) {
        showError(`"${f.name}" isn't a supported file type. Please use JPG, PNG, HEIC, or PDF.`);
        continue;
      }
      if (f.size > MAX_FILE_BYTES) {
        showError(`"${f.name}" is larger than 10 MB. Please choose a smaller file.`);
        continue;
      }

      // Compress images, pass through PDFs.
      let prepared = f;
      if (f.type.startsWith('image/')) {
        try {
          prepared = await compressImage(f);
        } catch (_e) {
          // HEIC on browsers that can't decode it: keep original.
          // The server accepts HEIC; total-size check will catch problems.
          prepared = f;
        }
      }

      accepted.push(prepared);
    }

    if (!multiple) accepted.splice(1); // single-file slot — only keep one

    selected.set(field, accepted);
    renderPreviews(field, zone);
  }

  function isAllowedFile(f) {
    if (ALLOWED_MIME.has((f.type || '').toLowerCase())) return true;
    // Safari sometimes sends empty MIME for HEIC — fall back to extension
    return ALLOWED_EXT.test(f.name || '');
  }

  function renderPreviews(field, zone) {
    // Remove any existing preview block immediately after the dropzone
    const existing = zone.nextElementSibling;
    if (existing && existing.classList.contains('intake-preview-list')) existing.remove();

    const files = selected.get(field);
    if (!files.length) return;

    const list = document.createElement('ul');
    list.className = 'intake-preview-list';

    files.forEach((file, idx) => {
      const li = document.createElement('li');
      li.className = 'intake-preview-item';

      const isImage = file.type.startsWith('image/');
      const thumb = document.createElement('div');
      thumb.className = 'intake-preview-thumb';
      if (isImage) {
        const img = document.createElement('img');
        img.alt = '';
        img.src = URL.createObjectURL(file);
        img.addEventListener('load', () => URL.revokeObjectURL(img.src));
        thumb.appendChild(img);
      } else {
        // PDF placeholder icon
        thumb.innerHTML = '<i data-lucide="file-text" class="intake-preview-thumb-icon"></i>';
      }

      const meta = document.createElement('div');
      meta.className = 'intake-preview-meta';
      meta.innerHTML = `
        <span class="intake-preview-name">${escapeText(file.name)}</span>
        <span class="intake-preview-size">${formatBytes(file.size)}</span>
      `;

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'intake-preview-remove';
      remove.setAttribute('aria-label', `Remove ${file.name}`);
      remove.innerHTML = '<i data-lucide="x"></i>';
      remove.addEventListener('click', () => {
        const arr = selected.get(field);
        arr.splice(idx, 1);
        selected.set(field, arr);
        renderPreviews(field, zone);
      });

      li.appendChild(thumb);
      li.appendChild(meta);
      li.appendChild(remove);
      list.appendChild(li);
    });

    zone.parentNode.insertBefore(list, zone.nextSibling);
    if (window.lucide) lucide.createIcons();
  }

  // ─── Image compression (Canvas → JPEG) ──────────────────────
  function compressImage(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        const { width, height } = img;
        const scale = Math.min(1, COMPRESS_MAX_DIMENSION / Math.max(width, height));
        const w = Math.round(width * scale);
        const h = Math.round(height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('canvas_toBlob_failed'));
              return;
            }
            // If compression somehow made it *bigger* (rare for already-small files), use original
            if (blob.size >= file.size && file.size <= 1.5 * 1024 * 1024) {
              resolve(file);
              return;
            }
            const newName = file.name.replace(/\.(heic|heif|png|jpg|jpeg)$/i, '.jpg');
            resolve(new File([blob], newName, { type: COMPRESS_TYPE, lastModified: Date.now() }));
          },
          COMPRESS_TYPE,
          COMPRESS_QUALITY,
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('image_decode_failed'));
      };
      img.src = url;
    });
  }

  // ─── Submit ─────────────────────────────────────────────────
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    // Validate required fields
    const required = ['first_name', 'last_name', 'date_of_birth', 'phone', 'email', 'insurance_company', 'residence_state', 'member_id'];
    for (const name of required) {
      const el = form.elements.namedItem(name);
      if (!el || !el.value.trim()) {
        showError('Please fill in all required fields.');
        if (el && el.focus) el.focus();
        return;
      }
    }

    // Email format
    const email = form.elements.namedItem('email').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('That email address doesn’t look right. Please double-check.');
      form.elements.namedItem('email').focus();
      return;
    }

    // DOB sanity — must be a valid date, not in the future
    const dobStr = form.elements.namedItem('date_of_birth').value;
    const dob = new Date(dobStr);
    if (isNaN(dob.getTime()) || dob > new Date()) {
      showError('Please enter a valid date of birth.');
      form.elements.namedItem('date_of_birth').focus();
      return;
    }

    // Total size check
    let totalBytes = 0;
    for (const arr of selected.values()) for (const f of arr) totalBytes += f.size;
    if (totalBytes > MAX_TOTAL_BYTES) {
      showError(`Your uploads total ${formatBytes(totalBytes)} — please choose smaller or fewer files (limit ~${formatBytes(MAX_TOTAL_BYTES)}).`);
      return;
    }

    // Build FormData
    const fd = new FormData();
    fd.set('first_name', form.elements.namedItem('first_name').value.trim());
    fd.set('last_name', form.elements.namedItem('last_name').value.trim());
    fd.set('date_of_birth', dobStr);
    fd.set('phone', form.elements.namedItem('phone').value.trim());
    fd.set('email', email);
    fd.set('insurance_company', form.elements.namedItem('insurance_company').value.trim());
    fd.set('residence_state', form.elements.namedItem('residence_state').value.trim());
    var referralEl = form.elements.namedItem('referral_source');
    if (referralEl) fd.set('referral_source', referralEl.value.trim());
    fd.set('member_id', form.elements.namedItem('member_id').value.trim());

    for (const [field, files] of selected.entries()) {
      for (const f of files) fd.append(field, f, f.name);
    }

    setLoading(true);
    try {
      const resp = await fetch(ENDPOINT, { method: 'POST', body: fd });
      if (resp.ok) {
        // Don't keep references to files in memory after success.
        selected.clear();
        // Soft redirect — preserves browser UX
        window.location.href = SUCCESS_URL;
        return;
      }

      // Non-2xx: try to map known error codes to a friendly message,
      // but never echo the server's raw error in case it ever contains PHI hints.
      let errCode = 'unknown';
      try {
        const j = await resp.json();
        errCode = j.error || 'unknown';
      } catch (_e) {
        // Non-JSON response (e.g. Vercel's own 413 page) — fall through to generic
      }
      showError(messageFor(errCode, resp.status));
    } catch (err) {
      // Network-level failure
      showError('We couldn’t reach our submission service. Please check your connection and try again, or call (424) 208-3120.');
    } finally {
      setLoading(false);
    }
  });

  function messageFor(errCode, status) {
    switch (errCode) {
      case 'missing_field':
      case 'missing_file':
        return 'It looks like one of the required fields is missing. Please review and try again.';
      case 'invalid_email':
        return 'That email address doesn’t look right. Please double-check.';
      case 'unsupported_file_type':
        return 'One of the files isn’t a supported type. Please use JPG, PNG, HEIC, or PDF.';
      case 'file_too_large':
      case 'total_too_large':
        return 'Your uploads are too large. Please choose smaller files and try again.';
      case 'delivery_failed':
      case 'submission_failed':
      case 'server_misconfigured':
      default:
        if (status === 413) return 'Your uploads are too large. Please choose smaller files and try again.';
        return 'Something went wrong while submitting your form. Please try again or call our admissions team at (424) 208-3120.';
    }
  }

  function setLoading(loading) {
    submitBtn.disabled = loading;
    submitBtn.classList.toggle('is-loading', loading);
    submitLabel.hidden = loading;
    submitLoading.hidden = !loading;
  }

  function showError(msg) {
    errorText.textContent = msg;
    errorBanner.hidden = false;
    errorBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function hideError() {
    errorBanner.hidden = true;
  }

  // ─── Utilities ──────────────────────────────────────────────
  function formatBytes(b) {
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
    return `${(b / 1024 / 1024).toFixed(1)} MB`;
  }
  function escapeText(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }
})();
