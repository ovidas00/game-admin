import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
  CBadge,
} from '@coreui/react'

import { useParams, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../lib/api'
import { formatDateTime } from '../../lib/format'

const GameView = () => {
  const { slug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const paramsObj = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams])

  const { data: response, isLoading } = useQuery({
    queryKey: ['game-players', slug, paramsObj],
    queryFn: async () => {
      const res = await api.get(`/admin/games/${slug}/players`, {
        params: paramsObj,
      })
      return res.data
    },
    enabled: Boolean(slug),
  })

  const players = response?.data || []
  const meta = response?.meta || { page: 1, totalPages: 1 }

  // pagination
  const handlePageChange = (newPage) => {
    setSearchParams({
      page: String(newPage),
    })
  }

  const getPageNumbers = (page, totalPages, delta = 2) => {
    const range = []
    const start = Math.max(1, page - delta)
    const end = Math.min(totalPages, page + delta)

    for (let i = start; i <= end; i++) {
      range.push(i)
    }

    return range
  }

  return (
    <CRow>
      <CCol>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Game Players</strong>
          </CCardHeader>

          <CCardBody>
            <CTable bordered hover responsive align="middle">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Account</CTableHeaderCell>
                  <CTableHeaderCell>Nickname</CTableHeaderCell>
                  <CTableHeaderCell>Score</CTableHeaderCell>
                  <CTableHeaderCell>Login Count</CTableHeaderCell>
                  <CTableHeaderCell>Last Login</CTableHeaderCell>
                  <CTableHeaderCell>IP</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Added</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {players.map((p, index) => (
                  <CTableRow key={p.id}>
                    {/* # */}
                    <CTableDataCell>
                      {(meta.page - 1) * (response?.limit || players.length) + index + 1}
                    </CTableDataCell>

                    {/* Account */}
                    <CTableDataCell>{p.Account}</CTableDataCell>

                    {/* Nickname */}
                    <CTableDataCell>{p.nickname}</CTableDataCell>

                    {/* Score */}
                    <CTableDataCell>{p.score}</CTableDataCell>

                    {/* Login Count */}
                    <CTableDataCell>{p.LoginCount}</CTableDataCell>

                    {/* Last Login */}
                    <CTableDataCell>{p.lasttime}</CTableDataCell>

                    {/* IP */}
                    <CTableDataCell>{p.loginip}</CTableDataCell>

                    {/* Status */}
                    <CTableDataCell>
                      <CBadge color={p.account_using === 1 ? 'success' : 'secondary'}>
                        {p.account_using === 1 ? 'Active' : 'Inactive'}
                      </CBadge>
                    </CTableDataCell>

                    {/* Added */}
                    <CTableDataCell className="text-nowrap">
                      {formatDateTime(p.AddDate)}
                    </CTableDataCell>
                  </CTableRow>
                ))}

                {!isLoading && players.length === 0 && (
                  <CTableRow>
                    <CTableDataCell colSpan={9} className="text-center text-muted">
                      No players found
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>

            {/* PAGINATION */}
            <div className="d-flex justify-content-end mt-3">
              <CPagination>
                <CPaginationItem
                  disabled={meta.page <= 1}
                  onClick={() => handlePageChange(meta.page - 1)}
                >
                  Prev
                </CPaginationItem>

                {/* First page */}
                {meta.page > 3 && (
                  <>
                    <CPaginationItem onClick={() => handlePageChange(1)}>1</CPaginationItem>
                    <CPaginationItem disabled>...</CPaginationItem>
                  </>
                )}

                {/* Dynamic window */}
                {getPageNumbers(meta.page, meta.totalPages).map((page) => (
                  <CPaginationItem
                    key={page}
                    active={meta.page === page}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </CPaginationItem>
                ))}

                {/* Last page */}
                {meta.page < meta.totalPages - 2 && (
                  <>
                    <CPaginationItem disabled>...</CPaginationItem>
                    <CPaginationItem onClick={() => handlePageChange(meta.totalPages)}>
                      {meta.totalPages}
                    </CPaginationItem>
                  </>
                )}

                <CPaginationItem
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => handlePageChange(meta.page + 1)}
                >
                  Next
                </CPaginationItem>
              </CPagination>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default GameView
