import toast from 'react-hot-toast';

export const showSuccess = (message) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-center',
  });
};

export const showError = (message) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-center',
  });
};

export const showLoading = (message) => {
  return toast.loading(message, {
    position: 'top-center',
  });
};

export const updateToast = (id, type, message) => {
  toast[type](message, {
    id,
    duration: type === 'error' ? 4000 : 3000,
    position: 'top-center',
  });
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};
