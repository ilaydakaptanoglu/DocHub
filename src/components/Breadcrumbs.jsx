import React from "react";
import { useFiles } from "../context/FileContext.jsx";

export default function Breadcrumbs() {
  const { breadcrumbs, goTo } = useFiles();

  return (
    // Ana navigasyon çubuğu için sade ve yatay hizalama
    // Arka plan rengi beyaz, yuvarlak köşeler ve hafif bir alt gölge
    <nav className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-sm" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.id} className="flex items-center">
            {index > 0 && (
              // Klasörler arasındaki ayırıcı olarak küçük bir slash işareti
              // Gri renkte ve daha az dikkat çekici
              <span className="text-sm text-gray-400 dark:text-gray-500 mx-1">/</span>
            )}
            {index === breadcrumbs.length - 1 ? (
              // Aktif (son) klasör için daha belirgin stil:
              // Kalın yazı tipi ve daha koyu metin rengi
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                {crumb.name}
              </span>
            ) : (
              // Tıklanabilir klasörler için geçişli ve daha nötr renkler
              // Fare üzerine gelince altı çizili
              <button
                onClick={() => goTo(crumb.id, crumb.name)}
                className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                {crumb.name}
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}