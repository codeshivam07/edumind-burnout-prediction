import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Alert, TextField,
  InputAdornment, TablePagination,
} from '@mui/material';
import { SearchRounded, HistoryRounded } from '@mui/icons-material';
import { getHistory } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import {
  burnoutLabel, burnoutColor,
  clusterLabel, clusterColor,
  academicLabel, academicColor,
  formatDate,
} from '../utils/labels';

export default function History() {
  const [rows, setRows] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    getHistory()
      .then((res) => {
        const data = res.data?.history || res.data || [];
        setRows(data);
        setFiltered(data);
      })
      .catch(() => setError('Failed to load history. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(rows);
    } else {
      const q = search.toLowerCase();
      setFiltered(rows.filter((r) =>
        burnoutLabel(r.burnout_score).toLowerCase().includes(q) ||
        clusterLabel(r.student_cluster).toLowerCase().includes(q) ||
        academicLabel(r.academic_prediction).toLowerCase().includes(q) ||
        String(r.anxiety ?? '').includes(q) ||
        String(r.depression ?? '').includes(q) ||
        String(r.stress ?? '').includes(q)
      ));
    }
    setPage(0);
  }, [search, rows]);

  if (loading) return <LoadingSpinner message="Fetching history..." />;

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Prediction History</Typography>
          <Typography variant="body2" sx={{ color: '#6b6b8a' }}>
            {rows.length} total record{rows.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <TextField
          size="small"
          placeholder="Search by burnout, cluster…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: { xs: '100%', sm: 280 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded sx={{ fontSize: 18, color: '#6b6b8a' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>{error}</Alert>}

      {rows.length === 0 ? (
        <EmptyState
          message="No predictions yet. Run your first assessment!"
          actionLabel="Run Prediction"
          actionPath="/predict"
        />
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Anxiety</TableCell>
                  <TableCell>Depression</TableCell>
                  <TableCell>Stress</TableCell>
                  <TableCell>Burnout Risk</TableCell>
                  <TableCell>Student Type</TableCell>
                  <TableCell>Academic Pressure</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6, color: '#6b6b8a' }}>
                      No records match your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((row, idx) => (
                    <TableRow
                      key={row._id || idx}
                      hover
                      sx={{ '&:last-child td': { border: 0 } }}
                    >
                      <TableCell>
                        <Typography sx={{ fontFamily: '"DM Mono", monospace', fontSize: '0.75rem', color: '#9b9bbf' }}>
                          {page * rowsPerPage + idx + 1}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.82rem', color: '#1a1a2e' }}>
                          {formatDate(row.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{
                          display: 'inline-flex', px: 1.5, py: 0.3, borderRadius: '8px',
                          bgcolor: 'rgba(232,64,64,0.08)', color: '#e84040',
                          fontFamily: '"DM Mono", monospace', fontSize: '0.8rem', fontWeight: 600,
                        }}>
                          {row.anxiety ?? '—'}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{
                          display: 'inline-flex', px: 1.5, py: 0.3, borderRadius: '8px',
                          bgcolor: 'rgba(58,134,232,0.08)', color: '#3a86e8',
                          fontFamily: '"DM Mono", monospace', fontSize: '0.8rem', fontWeight: 600,
                        }}>
                          {row.depression ?? '—'}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{
                          display: 'inline-flex', px: 1.5, py: 0.3, borderRadius: '8px',
                          bgcolor: 'rgba(240,165,0,0.08)', color: '#f0a500',
                          fontFamily: '"DM Mono", monospace', fontSize: '0.8rem', fontWeight: 600,
                        }}>
                          {row.stress ?? '—'}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={burnoutLabel(row.burnout_score)}
                          color={burnoutColor(row.burnout_score)}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: '8px', fontWeight: 500, fontSize: '0.75rem' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={clusterLabel(row.student_cluster)}
                          color={clusterColor(row.student_cluster)}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: '8px', fontWeight: 500, fontSize: '0.75rem' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={academicLabel(row.academic_prediction)}
                          color={academicColor(row.academic_prediction)}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: '8px', fontWeight: 500, fontSize: '0.75rem' }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            rowsPerPageOptions={[5, 10, 25]}
            sx={{ borderTop: '1px solid #e8e8f0' }}
          />
        </Card>
      )}
    </Box>
  );
}
