import React, { useState, useRef } from 'react';
import styles from './_style.module.css';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic'
import AccountLayout from '@/components/layout/AccountLayout';
import ModalPopUp from '@/components/core-components/ModalPopUp';

// Translation logic - start
import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';
import { useLoading } from '@/context/LoadingContext';

export const getStaticProps: GetStaticProps = getI18nStaticProps();
// Translation logic - end

const Documents: React.FC = () => {
  const { showLoading, hideLoading } = useLoading();

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
    showLoading();
    setShowModal(true);
    setTimeout(() => {
      hideLoading();
    }, 1000);
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
                Open Editor</button>
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
                Save</button>
              <button type="button" className={`btn btn-warning`} onClick={handleCloseEditor}>
                Cancel</button>
            </>
          }
        >
        {/* Editor content goes here ... */}
        <div className="container">
          <div className="row">
            <div className="col-md-12">
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
