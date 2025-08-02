import React from "react";
import { Autocomplete, Box, InputAdornment, TextField } from "@mui/material";
import CountryCodes from '../internals/data/CountryCodes.json';

interface PhoneNumberProps {
    code: string;
    size?: 'small' | 'medium';
    codeWidth?: string;
    codeLabel?: string;
    codePlaceholder?: string;
    numberLabel?: string;
    numberPlaceholder?: string;
    codeIcon?: React.ReactNode;
    numberIcon?: React.ReactNode;
    numberWidth?: string;
    number: string;
    gap?: number;
    required?: boolean;
    codeHandler: (field: string, value: any) => void;
    numberHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
    codeHelperText?: React.ReactNode;
    numberHelperText?: React.ReactNode;
    codeError?: boolean | undefined;
    numberError?: boolean | undefined;
}

const PhoneNumber: React.FC<PhoneNumberProps> = ({
    code,
    size = "medium",
    codeWidth = "20%",
    numberWidth = "80%",
    codeIcon,
    codeLabel,
    codePlaceholder,
    numberLabel,
    numberPlaceholder,
    numberIcon,
    number,
    required = false,
    gap = 2,
    codeHandler,
    numberHandler,
    codeHelperText = '',
    numberHelperText = '',
    codeError = false,
    numberError = false,
}) => {
    return (
        <Box sx={{ display: "flex", gap: gap }}>
            <Box sx={{ width: codeWidth }}>
                <Autocomplete
                    fullWidth
                    options={[
                        ...(CountryCodes?.map(con => ({
                            label: `${con.dial_code} (${con.code})`,
                            value: con.dial_code,
                        })) ?? []),
                    ]}
                    freeSolo
                    renderOption={(props, option) => {
                        const { key, ...rest } = props;
                        return (
                            <li
                                key={key}
                                {...rest}
                                style={{
                                    fontWeight: 400,
                                    color: 'inherit',
                                    ...(props.style || {}),
                                }}
                            >
                                {option.label}
                            </li>
                        );
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            required={required}
                            id="code"
                            size={size}
                            label={codeLabel}
                            name="code"
                            placeholder={codePlaceholder}
                            error={codeError}
                            helperText={codeHelperText}
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    codeIcon && <InputAdornment position="start">
                                        {codeIcon}
                                    </InputAdornment>
                                ),
                            }}
                            margin="normal"
                        />
                    )}
                    value={code}
                    onChange={(_, newValue) => {
                        codeHandler(
                            'code',
                            typeof newValue === 'string' ? newValue : newValue?.value || ''
                        );
                    }}
                    componentsProps={{
                        paper: {
                            sx: {
                                border: '1px solid #000',
                                borderRadius: 1,
                                width: '150px'
                            },
                        },
                    }}
                    sx={{
                        '& .MuiAutocomplete-endAdornment': { display: 'none' },
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            width: "100%"
                        }
                    }}
                />
            </Box>

            <TextField
                required={required}
                margin="normal"
                fullWidth
                sx={{ width: numberWidth }}
                id="number"
                label={numberLabel}
                size={size}
                name="number"
                autoComplete="number"
                onChange={numberHandler}
                value={number}
                error={numberError}
                helperText={numberHelperText}
                autoFocus
                placeholder={numberPlaceholder}
                InputProps={{
                    startAdornment: (
                        numberIcon && <InputAdornment position="start">
                            {numberIcon}
                        </InputAdornment>
                    ),
                }}
                 sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                }
              }}
            />
        </Box>
    );
};

export default PhoneNumber;