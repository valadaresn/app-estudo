import React, { useEffect, useState, useCallback } from 'react';
import { Drawer, Box } from '@mui/material';
import { parseCSV } from '../util/csvUtils';
import { Lei } from '../models/Lei';
import FlashCard, { FlashCardForm } from './FlashCard';
import { getAncestors, mapRowToLei } from '../util/leiUtils';

const StudyScreen: React.FC = () => {
    const [data, setData] = useState<Lei[]>([]);
    const [selectedLei, setSelectedLei] = useState<Lei | null>(null);
    const [ancestorsInfo, setAncestorsInfo] = useState<string>("");
    const [defaultQuestion, setDefaultQuestion] = useState<string>("");

    // Função para construir o flash card usando os ancestrais e o dispositivo atual
    const buildFlashCard = useCallback((lei: Lei, leis: Lei[]) => {
        const ancestors = getAncestors(lei, leis);
        const ancestorsStr = ancestors
            .map(a => `${a.tipo.toUpperCase()} (${a.numero}): ${a.dispositivo}`)
            .join(" -> ");
        setAncestorsInfo(ancestorsStr || "Nenhum pai");
        setDefaultQuestion(lei.dispositivo);
    }, [getAncestors]);

    useEffect(() => {
        fetch('/cf_csv.csv')
            .then(response => response.text())
            .then(text => {
                const rows = parseCSV(text, 1000);
                const dataRows = rows.slice(1);
                const leis = dataRows.map(mapRowToLei);
                setData(leis);
                if (leis.length > 0) {
                    setSelectedLei(leis[0]);
                    buildFlashCard(leis[0], leis);
                }
            });
    }, [buildFlashCard]);

    const handleSelectionChange = (index: number) => {
        const lei = data[index];
        setSelectedLei(lei);
        buildFlashCard(lei, data);
    };

    const onSubmit = (formData: FlashCardForm) => {
        console.log("Flash Card enviado:", formData);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: '40%',
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: '40%', boxSizing: 'border-box' },
                }}
            >
                <div style={{ padding: '16px' }}>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {data.map((lei, index) => (
                            <li key={index} style={{ marginBottom: '8px', cursor: 'pointer', fontSize: '0.875rem' }} onClick={() => handleSelectionChange(index)}>
                                {lei.dispositivo}
                            </li>
                        ))}
                    </ul>
                </div>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ marginTop: 2, border: '1px solid #ccc', padding: 2 }}>
                    <FlashCard
                        ancestorsInfo={ancestorsInfo}
                        defaultQuestion={defaultQuestion}
                        onSubmit={onSubmit}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default StudyScreen;