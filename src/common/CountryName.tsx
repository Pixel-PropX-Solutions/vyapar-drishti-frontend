import React from "react";
import { alpha, Avatar, Box, FormControl, FormHelperText, InputAdornment, InputLabel, ListItemIcon, ListItemText, MenuItem, Select, Slide } from "@mui/material";
import theme from "@/theme";
import { Public, KeyboardArrowRight } from "@mui/icons-material";
import CountryCodes from '../internals/data/CountryCodes.json';
interface CountryNameProps {
    handleInputChange: (field: string, value: string) => void;
    value: string,
    formErrors: Record<string, string>,
    isHelperText?: boolean,
    focusedField: string,
    helperText?: string;
    setFocusedField: React.Dispatch<React.SetStateAction<string>>;
}


const CountryName: React.FC<CountryNameProps> = ({ handleInputChange, value, helperText, setFocusedField, focusedField, formErrors, isHelperText }) => {
    return (
        <Slide direction="up" in timeout={1300}>
            <FormControl fullWidth error={!!formErrors.country}>
                <InputLabel id="country-select-label" sx={{
                    color: focusedField === 'country' ? theme.palette.primary.main : undefined,
                    '&.Mui-focused': {
                        color: theme.palette.primary.main
                    }
                }}>
                    Country
                </InputLabel>
                <Select
                    labelId="country-select-label"
                    value={value}
                    label="Country"
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    onFocus={() => setFocusedField('country')}
                    onBlur={() => setFocusedField('')}
                    startAdornment={
                        <InputAdornment position="start">
                            <Box sx={{
                                p: 0.5,
                                borderRadius: 1,
                                backgroundColor: focusedField === 'country'
                                    ? alpha(theme.palette.primary.main, 0.1)
                                    : 'transparent',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <Public color={focusedField === 'country' ? 'primary' : 'action'} sx={{ fontSize: 20 }} />
                            </Box>
                        </InputAdornment>
                    }
                    renderValue={(selected) => {
                        const country = CountryCodes.find(c => c.name === selected);
                        return country ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 1 }}>
                                <Avatar
                                    src={`/src/assets/flags/${country.code.toLowerCase()}.png`}
                                    alt={country.code}
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`
                                    }}
                                    imgProps={{
                                        onError: (e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null;
                                            target.src = `https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`;
                                        }
                                    }}
                                />
                                <span>{country.name}</span>
                            </Box>
                        ) : (
                            <Box sx={{ ml: 1 }}>{selected}</Box>
                        );
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            backgroundColor: focusedField === 'country'
                                ? alpha(theme.palette.primary.main, 0.02)
                                : alpha(theme.palette.background.paper, 0.5),
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                                transform: 'translateY(-1px)',
                                boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
                            },
                            '&.Mui-focused': {
                                transform: 'translateY(-2px)',
                                boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.15)}`,
                            }
                        }
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                maxHeight: 300,
                                borderRadius: 1,
                                boxShadow: `0 20px 60px ${alpha(theme.palette.common.black, 0.15)}`,
                                backdropFilter: 'blur(20px)',
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                '& .MuiMenuItem-root': {
                                    borderRadius: 1,
                                    margin: '2px 8px',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                        transform: 'translateX(4px)',
                                    }
                                }
                            }
                        }
                    }}
                >
                    {CountryCodes.map((country) => (
                        <MenuItem key={country.code} value={country.name}>
                            <ListItemIcon>
                                <Avatar
                                    src={`/src/assets/flags/${country.code.toLowerCase()}.png`}
                                    alt={country.code}
                                    sx={{
                                        width: 24,
                                        height: 24,
                                        boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`
                                    }}
                                    imgProps={{
                                        onError: (e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null;
                                            target.src = `https://flagcdn.com/24x18/${country.code.toLowerCase()}.png`;
                                        }
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary={country.name}
                                sx={{
                                    '& .MuiListItemText-primary': {
                                        fontWeight: 500
                                    }
                                }}
                            />
                            <KeyboardArrowRight sx={{
                                opacity: 0.5,
                                transition: 'opacity 0.2s ease',
                                '.MuiMenuItem-root:hover &': {
                                    opacity: 1
                                }
                            }} />
                        </MenuItem>
                    ))}
                </Select>
                {isHelperText && <FormHelperText sx={{
                    marginLeft: 0,
                    marginTop: 1,
                    fontSize: '0.75rem',
                    color: formErrors.country
                        ? theme.palette.error.main
                        : alpha(theme.palette.text.secondary, 0.7)
                }}>
                    {formErrors.country || helperText || 'Select your country for billing purposes'}
                </FormHelperText>}
            </FormControl>
        </Slide>
    );
};

export default CountryName;