import React, { useState, useMemo, useCallback, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Drawer,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Pagination,
    Button,
    List,
    ListItemIcon,
    ListItemButton,
    ListItemText,
    Divider,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { FileDownload, FilterList, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { toast } from 'react-toastify';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log(customers)

    const getCustomers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/customerlist', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
			setCustomers(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getCustomers();
    }, [getCustomers])

	return (
		<div>
			<h1>Customer </h1>
			{/* Additional components or logic can be added here */}
		</div>
	);
}

export default CustomerList;