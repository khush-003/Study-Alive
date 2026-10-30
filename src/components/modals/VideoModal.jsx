import Modal from '../common/Modal.jsx';

/**
 * Props: isOpen (boolean), title (string), length (string), onClose (function).
 * Usage: <VideoModal isOpen={Boolean(video)} title={video?.title} length={video?.duration} onClose={closeVideo} />
 */
export default function VideoModal({ isOpen, title, length, videoUrl, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Study video'} maxWidth="max-w-3xl">
      <div className="flex aspect-video items-center justify-center rounded-2xl bg-slate-950 text-white">
        {videoUrl
          ? <video className="h-full w-full rounded-2xl" controls src={videoUrl} aria-label={title || 'Study video'} />
          : <div className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-2xl">▶</span>
            <p className="mt-3 text-sm font-semibold">Video lesson</p>
            <p className="mt-1 text-xs text-slate-300">{length || 'Length unavailable'}</p>
          </div>}
      </div>
      {!videoUrl && <p className="text-xs text-content-muted">This lesson preview is ready. Video playback will be available when a video file is uploaded.</p>}
    </Modal>
  );
}
