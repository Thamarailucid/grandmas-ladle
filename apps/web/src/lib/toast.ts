import toast from 'react-hot-toast';

export function showSuccessToast(message: string) {
  toast.success(message, {
    style: {
      background: '#2C4A3B',
      color: '#FAF4E6',
    },
    iconTheme: {
      primary: '#FAF4E6',
      secondary: '#2C4A3B',
    },
  });
}

export function showErrorToast(message: string) {
  toast.error(message, {
    style: {
      background: '#B85C3E',
      color: '#FAF4E6',
    },
    iconTheme: {
      primary: '#FAF4E6',
      secondary: '#B85C3E',
    },
  });
}

export function showInfoToast(message: string) {
  toast(message, {
    style: {
      background: '#B8925A',
      color: '#3E2C22',
    },
  });
}
