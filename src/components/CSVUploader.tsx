import React, { useState } from 'react';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { parseCSV } from '../util/csvUtils';
import { Lei } from '../models/Lei';


const CSVUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const batch = writeBatch(db);
    const reader = new FileReader();

    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const rows = parseCSV(text, 10);

      const collectionRef = collection(db, 'leis');

      rows.forEach((data) => {
        const lei: Lei = {
          texto_corrigido: data[0] || "",
          hierarquia: data[1] || "",
          tipo: data[2] || "",
          numero: data[3] || "",
          artigo: data[4] || "",
          paragrafo: data[5] || "",
          inciso: data[6] || "",
          aliena: data[7] || "",
          parte: data[8] || "",
          titulo: data[9] || "",
          capitulo: data[10] || "",
          secao: data[11] || "",
          subsecao: data[12] || "",
          ano: data[13] || "",
        };
        const docRef = doc(collectionRef); // Cria uma referência de documento
        batch.set(docRef, lei);
      });

      await batch.commit();
      alert('Upload successful!');
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload CSV</button>
    </div>
  );
};

export default CSVUploader;