import React, { useEffect, useState, useCallback } from 'react';
import { Box, Grid } from '@mui/material';
import { parseCSV } from '../util/csvUtils';
import { Lei } from '../models/Lei';
import FlashCard, { FlashCardForm } from './FlashCard';
import { getAncestors, mapRowToLei } from '../util/leiUtils';

const StudyScreen: React.FC = () => {
    const [data, setData] = useState<Lei[]>([]);
    const [selectedLei, setSelectedLei] = useState<Lei | null>(null);
    const [ancestorsInfo, setAncestorsInfo] = useState<string>("");
    const [defaultQuestion, setDefaultQuestion] = useState<string>("");

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
        <Box sx={{ width: '100%', margin: 0, padding: 0, overflow: 'hidden' }}>
            <Grid container spacing={2} sx={{ width: '100%', margin: 0 }}>
                <Grid item xs={3}>
                    <Box sx={{ height: '90vh', overflowY: 'auto', border: '1px solid #ccc', p: 2 }}>
                        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                            {data.map((lei, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSelectionChange(index)}
                                    style={{
                                        marginBottom: '8px',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    {lei.dispositivo}
                                </li>
                            ))}
                        </ul>
                    </Box>
                </Grid>
                <Grid item xs={9}>
                    <Box sx={{ border: '1px solid #ccc', p: 3, height: '90vh', overflow: 'auto' }}>
                        <FlashCard
                            ancestorsInfo={ancestorsInfo}
                            defaultQuestion={defaultQuestion}
                            onSubmit={onSubmit}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default StudyScreen;