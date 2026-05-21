/**
 * AETHER — Main: Reservation form & Supabase
 */
(function () {
  'use strict';

  const form = document.getElementById('reservationForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');
  const formError = document.getElementById('formError');
  const modal = document.getElementById('reservationModal');
  const modalClose = document.getElementById('reservationModalClose');
  const modalConfirm = document.getElementById('reservationModalConfirm');

  if (!form) return;

  function openModal() {
    if (!modal) return;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose?.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    submitBtn?.focus();
  }

  modalClose?.addEventListener('click', closeModal);
  modalConfirm?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (!e.target.closest('.reservation-modal__dialog')) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
  });

  function validateForm(data) {
    const errors = [];

    if (!data.user_name || data.user_name.trim().length < 2) {
      errors.push('이름을 2자 이상 입력해 주세요.');
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.user_email || !emailRe.test(data.user_email)) {
      errors.push('올바른 이메일 주소를 입력해 주세요.');
    }

    if (!data.destination) {
      errors.push('목적지를 선택해 주세요.');
    }

    if (!data.departure_date) {
      errors.push('출발 날짜를 선택해 주세요.');
    } else {
      const selected = new Date(data.departure_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        errors.push('출발 날짜는 오늘 이후여야 합니다.');
      }
    }

    return errors;
  }

  function showError(msg) {
    if (formError) {
      formError.textContent = msg;
      formError.hidden = false;
    }
    if (formSuccess) formSuccess.hidden = true;
  }

  function showSuccess() {
    if (formSuccess) formSuccess.hidden = true;
    if (formError) formError.hidden = true;
    form.reset();
    openModal();
  }

  async function saveToSupabase(data) {
    const { url, anonKey, tableName } = typeof SUPABASE_CONFIG !== 'undefined'
      ? SUPABASE_CONFIG
      : { url: '', anonKey: '', tableName: 'reservations' };

    if (!url || !anonKey) {
      console.info('[AETHER] Supabase 미설정 — 로컬 모드로 성공 처리');
      return { ok: true, local: true };
    }

    if (typeof supabase === 'undefined') {
      throw new Error('Supabase SDK를 불러올 수 없습니다.');
    }

    const client = supabase.createClient(url, anonKey);

    const { error } = await client.from(tableName).insert([
      {
        user_name: data.user_name.trim(),
        user_email: data.user_email.trim(),
        destination: data.destination,
        departure_date: data.departure_date,
        created_at: new Date().toISOString()
      }
    ]);

    if (error) throw error;
    return { ok: true };
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (formError) formError.hidden = true;
    if (formSuccess) formSuccess.hidden = true;

    const formData = new FormData(form);
    const data = {
      user_name: formData.get('user_name'),
      user_email: formData.get('user_email'),
      destination: formData.get('destination'),
      departure_date: formData.get('departure_date')
    };

    const errors = validateForm(data);
    if (errors.length) {
      showError(errors[0]);
      return;
    }

    submitBtn?.classList.add('btn--loading');
    submitBtn.disabled = true;

    try {
      await saveToSupabase(data);
      showSuccess();
    } catch (err) {
      console.error('[AETHER] Submit error:', err);
      showError('요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      submitBtn?.classList.remove('btn--loading');
      submitBtn.disabled = false;
    }
  });
})();
