import { useFiles } from "../context/FileContext.jsx";

export default function UploadDropzone() {
  const { addFiles } = useFiles();

  const onDrop = async (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) {
      try {
        await addFiles(e.dataTransfer.files);
      } catch (err) {
        console.error("Dosya yüklenirken hata oluştu:", err);
        alert("Dosya yüklenirken bir hata oluştu.");
      }
    }
  };

  const onDrag = (e) => e.preventDefault();

  return (
    <div className="dropzone" onDragOver={onDrag} onDrop={onDrop}>
      PDF veya Video dosyalarını buraya sürükleyip bırakabilirsin.
    </div>
  );
}