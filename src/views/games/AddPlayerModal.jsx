import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CButton,
  CSpinner,
} from '@coreui/react'
import { useState } from 'react'

const AddPlayerModal = ({ visible, onClose, onSubmit, loading }) => {
  const [form, setForm] = useState({
    username: '',
    nickname: '',
    password: '',
    money: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // native HTML validation
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity()
      return
    }

    onSubmit(form)
  }

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Add Player</CModalTitle>
      </CModalHeader>

      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          <CFormInput
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="mb-3"
          />

          <CFormInput
            label="Nickname"
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            required
            className="mb-3"
          />

          <CFormInput
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            className="mb-3"
          />

          <CFormInput
            label="Money"
            type="number"
            name="money"
            value={form.money}
            onChange={handleChange}
            required
            min={0}
          />
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={onClose}>
            Cancel
          </CButton>

          <CButton type="submit" color="primary" disabled={loading}>
            {loading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Creating...
              </>
            ) : (
              'Create'
            )}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

export default AddPlayerModal
