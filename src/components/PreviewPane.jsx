import { useFiles } from "../context/FileContext.jsx";

export default function PreviewPane(){
  const { selected } = useFiles();
  const item = selected();

  if (!item || item.kind !== "file") {
    return <div className="panel">Bir dosya seçtiğinde burada önizleme görünecek.</div>;
  }

  const isPDF = item.mime === "application/pdf" || item.name.toLowerCase().endsWith(".pdf");
  const isVideo = (item.mime || "").startsWith("video/");

  return (
    <div className="panel">
      <div style={{ marginBottom: 8, fontWeight: 600 }}>{item.name}</div>
      <div className="preview">
        {isPDF && (
          <iframe
            title={item.name}
            src={item.url}
            style={{ width: "100%", height: "60vh", border: "none" }}
          />
        )}
        {isVideo && (
          <video src={item.url} controls style={{ width: "100%", height: "60vh", background: "black" }} />
        )}
        {!isPDF && !isVideo && (
          <div style={{ padding: 16, color: "#9ca3af" }}>Bu dosya için önizleme yok.</div>
        )}
      </div>
    </div>
  );
}