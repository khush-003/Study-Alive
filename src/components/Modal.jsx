import CommonModal from './common/Modal.jsx';

export default function Modal({ title, onClose, children, size = 'max-w-md' }) {
  return <CommonModal isOpen onClose={onClose} title={title} maxWidth={size}>{children}</CommonModal>;
}
