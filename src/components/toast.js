let timeoutId;

export function showToast(message) {
  const toast = document.querySelector('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    toast.hidden = true;
  }, 4500);
}
