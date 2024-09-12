import React, { useState, useRef } from 'react';
import styles from './_style.module.css';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic'
import AccountLayout from '@/components/layout/AccountLayout';
import ModalPopUp from '@/components/core-components/ModalPopUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faClose, faPlus } from '@fortawesome/free-solid-svg-icons';

// Translation logic - start
import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';

export const getStaticProps: GetStaticProps = getI18nStaticProps();
// Translation logic - end

const CustomEditor3 = dynamic(() => import( '@/components/core-components/CKEditorComponent' ), { ssr: false } );

const Documents: React.FC = () => {

  const { t } = useTranslation('common');
  const router = useRouter();
  const { id } = router.query;
  
  const [showModal, setShowModal] = useState(false);
  const [editorData, setEditorData] = useState('<h1>Welcome!</h1><p>This is the initial content of the editor.</p>');

  const setEditContent = (data: any) => {
    console.log('Editor content:', data);
    setEditorData(data)
  }

  const handleShow = () => {
    setShowModal(true);
  };

  const handleCloseEditor = () => {
    setShowModal(false);
  };
  
  const handleOkEditor = () => {
    console.log("🚀 ~ editorData:", editorData)
  };

  return (
    <>
      <AccountLayout>
        <div className="container-fluid mt-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className={`${styles.title} mb-3`}>
              <span className={styles.textColor}>{t('ACCOUNT.SIDE_MENU.DOCUMENTS')}</span>
            </h1>
            <div className={styles.buttonGroup}>
              <button className={`${styles.btn} btn btn-success`} onClick={handleShow}>
                <FontAwesomeIcon icon={faPlus} /> Open Editor</button>
            </div>
          </div>
        </div>
        <p>This is the content for Editor.</p>
        
        <ModalPopUp
          show={showModal}
          handleClose={handleCloseEditor}
          title="CK Editor"
          sizeElement="modal-xl modal-dialog"
          footer={
            <>
              <button type="button" style={{ marginRight: '.5rem' }} className={`btn btn-success`}  onClick={handleOkEditor}>
                <FontAwesomeIcon icon={faCheck} /> Save</button>
              <button type="button" className={`btn btn-warning`} onClick={handleCloseEditor}>
                <FontAwesomeIcon icon={faClose} /> Cancel</button>
            </>
          }
        >
        {/* Editor content goes here ... */}
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <CustomEditor3 initialData={editorData} onChange={setEditContent}/>
              <div>
                <h3>Live Output</h3>
                <div dangerouslySetInnerHTML={{ __html: editorData }} />
              </div>
            </div>
          </div>
        </div>
        </ModalPopUp>
      </AccountLayout>
    </>
  );
};

export default Documents;
