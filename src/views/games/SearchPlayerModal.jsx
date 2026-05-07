import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CButton,
} from '@coreui/react'

const SearchPlayerModal = ({ visible, onClose, filters, onChange, onApply, onReset }) => {
  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Search Players</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <CFormInput label="ID" name="id" value={filters.id} onChange={onChange} className="mb-3" />

        <CFormInput
          label="Account"
          name="account"
          value={filters.account}
          onChange={onChange}
          className="mb-3"
        />

        <CFormInput label="Nickname" name="nickname" value={filters.nickname} onChange={onChange} />
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" onClick={onReset}>
          Reset
        </CButton>

        <CButton color="primary" onClick={onApply}>
          Apply
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default SearchPlayerModal
