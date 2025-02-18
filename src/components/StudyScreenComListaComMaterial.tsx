import React, { useEffect, useState, useCallback } from 'react';
import { Drawer, List, ListItemText, Typography, Box, ListItemButton } from '@mui/material';
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
                    width: 240,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
                }}
            >
                <List>
                    {data.map((lei, index) => (
                        <ListItemButton key={index} onClick={() => handleSelectionChange(index)}>
                            <ListItemText primary={`${lei.tipo.toUpperCase()} - ${lei.numero}`} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {/* <Typography variant="h6" gutterBottom>
                    Tela de Estudos - Dispositivos da Lei
                </Typography> */}
                {selectedLei && (
                    <Typography variant="body1" gutterBottom>
                        Dispositivo selecionado: {selectedLei.dispositivo}
                    </Typography>
                )}
                <Box sx={{ marginTop: 2, border: '1px solid #ccc', padding: 2 }}>
                    {/* <Typography variant="h6" gutterBottom>
                        Flash Card
                    </Typography> */}
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