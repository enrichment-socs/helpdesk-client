import ConfirmDialog from '../components/shared/ConfirmDialog';
import { createConfirmation } from 'react-confirm';

export const confirm = (confirmation) => {
  const createConfirm = createConfirmation(ConfirmDialog);
  return createConfirm({ confirmation });
};
