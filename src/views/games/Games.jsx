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
  CBadge,
  CButton,
  CAvatar,
  CButtonGroup,
} from '@coreui/react'

import { useQuery } from '@tanstack/react-query'
import api from '../../lib/api'
import { formatDateTime } from '../../lib/format'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'

const Games = () => {
  const navigate = useNavigate()

  const { data: games = [], isLoading } = useQuery({
    queryKey: ['games'],
    queryFn: () => api.get('/admin/games').then((res) => res.data),
  })

  return (
    <CRow>
      <CCol>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Games</strong>
          </CCardHeader>

          <CCardBody>
            <CTable striped hover responsive align="middle">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Game</CTableHeaderCell>
                  <CTableHeaderCell>Category</CTableHeaderCell>
                  <CTableHeaderCell>Slug</CTableHeaderCell>
                  <CTableHeaderCell>Badge</CTableHeaderCell>
                  <CTableHeaderCell>Featured</CTableHeaderCell>
                  <CTableHeaderCell>Created At</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {games.map((game, index) => (
                  <CTableRow key={game.id}>
                    {/* # */}
                    <CTableDataCell>{index + 1}</CTableDataCell>

                    {/* Game */}
                    <CTableDataCell>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={game.image}
                          alt={game.name}
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          className="rounded bg-light"
                        />
                        <div className="fw-semibold">{game.name}</div>
                      </div>
                    </CTableDataCell>

                    {/* Category */}
                    <CTableDataCell>{game.category}</CTableDataCell>

                    {/* Slug */}
                    <CTableDataCell>{game.slug}</CTableDataCell>

                    {/* Badge */}
                    <CTableDataCell>
                      {game.badge ? <CBadge color="info">{game.badge}</CBadge> : '-'}
                    </CTableDataCell>

                    {/* Featured */}
                    <CTableDataCell>
                      <CBadge color={game.isFeatured ? 'success' : 'secondary'}>
                        {game.isFeatured ? 'Yes' : 'No'}
                      </CBadge>
                    </CTableDataCell>

                    {/* Created */}
                    <CTableDataCell className="text-nowrap">
                      {formatDateTime(game.createdAt)}
                    </CTableDataCell>

                    {/* Actions */}
                    <CTableDataCell>
                      <CButtonGroup size="sm">
                        <CButton
                          color="secondary"
                          variant="outline"
                          onClick={() => navigate(`/games/${game.slug}/edit`)}
                        >
                          <CIcon icon={cilPencil} size="sm" className="me-1" />
                          Edit
                        </CButton>

                        <CButton color="primary" onClick={() => navigate(`/games/${game.slug}`)}>
                          View
                        </CButton>
                      </CButtonGroup>
                    </CTableDataCell>
                  </CTableRow>
                ))}

                {!isLoading && games.length === 0 && (
                  <CTableRow>
                    <CTableDataCell colSpan={8} className="text-center text-muted">
                      No games found
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Games
