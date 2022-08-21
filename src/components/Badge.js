import { useTheme } from '@mui/material/styles';

export default function Badge({ value, active, banned }) {
  const theme = useTheme();

  return (
    <span
      style={{
        height: ' 22px',
        minWidth: '22px',
        lineHeight: 0,
        borderRadius: '6px',
        cursor: 'default',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        display: ' inline-flex',
        justifyContent: 'center',
        padding: ' 0px 8px',
        fontSize: ' 0.75rem',
        fontWeight: 700,
        textTransform: 'capitalize',
        color: active ? theme.palette.primary.dark : theme.palette.error.dark,
        backgroundColor: active ? '#54d62c29' : '#ff484229',
      }}
    >
      {value}
    </span>
  );
}
