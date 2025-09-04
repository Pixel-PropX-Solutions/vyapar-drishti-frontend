import React from "react";
import { MenuItem, Grid, TextField } from "@mui/material";

interface MonthYearSelectorProps {
    month: number;
    year: number;
    onMonthChange: (month: number) => void;
    onYearChange: (year: number) => void;
    startYear?: number;
    endYear?: number;
}

const months = [
    {
        label: 'April',
        value: 4
    },
    {
        label: 'May',
        value: 5
    },
    {
        label: 'June',
        value: 6
    },
    {
        label: 'July',
        value: 7
    },
    {
        label: 'August',
        value: 8
    },
    {
        label: 'September',
        value: 9
    },
    {
        label: 'October',
        value: 10
    },
    {
        label: 'November',
        value: 11
    },
    {
        label: 'December',
        value: 12
    },
    {
        label: 'January',
        value: 1
    },
    {
        label: 'February',
        value: 2
    },
    {
        label: 'March',
        value: 3
    },

]


const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({
    month,
    year,
    onMonthChange,
    onYearChange,
    startYear = 2000,
    endYear = new Date().getFullYear()
}) => {
    return (
        <Grid container spacing={1}>
            {/* Month Selector */}
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    size='small'
                    label="Month"
                    name="month"
                    value={month.toString()}
                    onChange={(e) => {
                        onMonthChange(parseInt(e.target.value))
                    }}
                    required
                    select
                    variant="outlined"
                >
                    {months.map((m) => (
                        <MenuItem key={m.value} value={m.value}>
                            {m.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>

            {/* Year Selector */}
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    size='small'
                    label="Year"
                    disabled
                    name="year"
                    value={year.toString()}
                    onChange={(e) => {
                        onYearChange(parseInt(e.target.value))
                    }}
                    required
                    select
                    variant="outlined"
                >
                    {Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)
                        .reverse()
                        .map((y) => (
                            <MenuItem key={y} value={y}>
                                {y}
                            </MenuItem>
                        ))}
                </TextField>
            </Grid>
        </Grid>
    );
};

export default MonthYearSelector;
