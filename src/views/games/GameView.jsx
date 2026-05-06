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
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CButton,
  CSpinner,
} from '@coreui/react'
import { useMemo, useState, useEffect } from 'react'

import { useParams, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import api from '../../lib/api'
import { formatDateTime } from '../../lib/format'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilSearch } from '@coreui/icons'

const GameView = () => {
  const { slug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  // modal state
  const [visible, setVisible] = useState(false)

  // filters state
  const [filters, setFilters] = useState({
    id: '',
    account: '',
    nickname: '',
  })

  const [addVisible, setAddVisible] = useState(false)

  const [newPlayer, setNewPlayer] = useState({
    username: '',
    nickname: '',
    password: '',
    money: '',
  })

  const handleAddChange = (e) => {
    const { name, value } = e.target
    setNewPlayer((prev) => ({ ...prev, [name]: value }))
  }

  const addPlayerMutation = useMutation({
    mutationFn: (newPlayer) => api.post(`/admin/games/${slug}/player`, newPlayer),

    onSuccess: () => {
      // close modal
      setAddVisible(false)

      // reset form
      setNewPlayer({
        username: '',
        nickname: '',
        password: '',
        money: '',
      })

      // refresh players list (better than refetch)
      queryClient.invalidateQueries({
        queryKey: ['game-players', slug],
      })
    },

    onError: (err) => {
      console.error(err)
    },
  })

  const handleAddPlayer = () => {
    addPlayerMutation.mutate(newPlayer)
  }

  // sync filters with URL
  useEffect(() => {
    Promise.resolve().then(() => {
      setFilters({
        id: searchParams.get('id') || '',
        account: searchParams.get('account') || '',
        nickname: searchParams.get('nickname') || '',
      })
    })
  }, [searchParams])

  const paramsObj = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams])

  const { data: response, isFetching } = useQuery({
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
      ...paramsObj,
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

  // input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  // apply filters
  const applyFilters = () => {
    const newParams = {
      ...paramsObj,
      ...filters,
      page: '1',
    }

    Object.keys(newParams).forEach((key) => {
      if (!newParams[key]) delete newParams[key]
    })

    setSearchParams(newParams)
    setVisible(false)
  }

  // reset filters
  const resetFilters = () => {
    setFilters({ id: '', account: '', nickname: '' })
    setSearchParams({ page: '1' })
    setVisible(false)
  }

  return (
    <CRow>
      <CCol>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>Game Players</strong>
          </CCardHeader>

          <CCardBody>
            <div className="d-flex align-items-center gap-2 mb-3">
              <CButton
                color="secondary"
                variant="outline"
                className="d-flex align-items-center gap-2"
                onClick={() => setVisible(true)}
              >
                <CIcon icon={cilSearch} />
                Search
              </CButton>

              <CButton color="primary" onClick={() => setAddVisible(true)}>
                <CIcon icon={cilPlus} className="me-2" />
                Add Player
              </CButton>
            </div>

            <CTable bordered hover responsive align="middle">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
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
                {isFetching ? (
                  <CTableRow>
                    <CTableDataCell colSpan={9} className="text-center py-5">
                      <CSpinner color="primary" variant="grow" />
                    </CTableDataCell>
                  </CTableRow>
                ) : players.length > 0 ? (
                  players.map((p) => (
                    <CTableRow key={p.id}>
                      <CTableDataCell>{p.id}</CTableDataCell>
                      <CTableDataCell>{p.Account}</CTableDataCell>
                      <CTableDataCell>{p.nickname}</CTableDataCell>
                      <CTableDataCell>{p.score}</CTableDataCell>
                      <CTableDataCell>{p.LoginCount}</CTableDataCell>
                      <CTableDataCell>{p.lasttime}</CTableDataCell>
                      <CTableDataCell>{p.loginip}</CTableDataCell>

                      <CTableDataCell>
                        <CBadge color={p.account_using === 1 ? 'success' : 'secondary'}>
                          {p.account_using === 1 ? 'Active' : 'Inactive'}
                        </CBadge>
                      </CTableDataCell>

                      <CTableDataCell className="text-nowrap">
                        {formatDateTime(p.AddDate)}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan={9} className="text-center text-muted">
                      No players found
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>

            {/* PAGINATION */}
            {!isFetching && (
              <div className="d-flex justify-content-end mt-3">
                <CPagination>
                  <CPaginationItem
                    disabled={meta.page <= 1}
                    onClick={() => handlePageChange(meta.page - 1)}
                  >
                    Prev
                  </CPaginationItem>

                  {meta.page > 3 && (
                    <>
                      <CPaginationItem onClick={() => handlePageChange(1)}>1</CPaginationItem>
                      <CPaginationItem disabled>...</CPaginationItem>
                    </>
                  )}

                  {getPageNumbers(meta.page, meta.totalPages).map((page) => (
                    <CPaginationItem
                      key={page}
                      active={meta.page === page}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </CPaginationItem>
                  ))}

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
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* SEARCH MODAL */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Search Players</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CFormInput
            label="ID"
            name="id"
            value={filters.id}
            onChange={handleChange}
            className="mb-3"
          />

          <CFormInput
            label="Account"
            name="account"
            value={filters.account}
            onChange={handleChange}
            className="mb-3"
          />

          <CFormInput
            label="Nickname"
            name="nickname"
            value={filters.nickname}
            onChange={handleChange}
          />
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={resetFilters}>
            Reset
          </CButton>
          <CButton color="primary" onClick={applyFilters}>
            Apply
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ADD PLAYER MODAL */}
      <CModal visible={addVisible} onClose={() => setAddVisible(false)}>
        <CModalHeader>
          <CModalTitle>Add Player</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CFormInput
            label="Username"
            name="username"
            value={newPlayer.username}
            onChange={handleAddChange}
            className="mb-3"
          />

          <CFormInput
            label="Nickname"
            name="nickname"
            value={newPlayer.nickname}
            onChange={handleAddChange}
            className="mb-3"
          />

          <CFormInput
            label="Password"
            type="password"
            name="password"
            value={newPlayer.password}
            onChange={handleAddChange}
            className="mb-3"
          />

          <CFormInput
            label="Money"
            type="number"
            name="money"
            value={newPlayer.money}
            onChange={handleAddChange}
          />
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setAddVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleAddPlayer} disabled={addPlayerMutation.isPending}>
            {addPlayerMutation.isPending ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Creating...
              </>
            ) : (
              'Create'
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default GameView
