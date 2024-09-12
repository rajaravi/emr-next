import React, { useState, useRef } from 'react';
import styles from './_style.module.css';
import { useRouter } from 'next/router';

import AccountLayout from '@/components/layout/AccountLayout';
import ModalPopUp from '@/components/core-components/ModalPopUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faClose, faPlus } from '@fortawesome/free-solid-svg-icons';
import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-react-documenteditor';
DocumentEditorContainerComponent.Inject(Toolbar);

// Translation logic - start
import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { getI18nStaticProps } from '@/utils/services/getI18nStaticProps';

export const getStaticProps: GetStaticProps = getI18nStaticProps();
// Translation logic - end

const Editor: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const editorContainerRef = useRef<DocumentEditorContainerComponent>(null);
  const { id } = router.query;
  
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => {
    setShowModal(true);
  };

  const handleCloseEditor = () => {
    setShowModal(false);
  };
  
  const handleOkEditor = () => {
    if (editorContainerRef.current) {
      const editorContent = editorContainerRef.current.documentEditor.serialize();
      console.log('Editor Content:', editorContent); // Save logic goes here
    }
  };


  return (
    <>
      <AccountLayout>
        <div className="container-fluid mt-2">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className={`${styles.title} mb-3`}>
              <span className={styles.textColor}>{t('ACCOUNT.SIDE_MENU.EDITOR')}</span>
            </h1>
            <div className={styles.buttonGroup}>
              <button className={`${styles.btn} btn btn-success`} onClick={handleShow}>
                <FontAwesomeIcon icon={faPlus} /> Add Document</button>
            </div>
          </div>
        </div>
        <p>This is the content for Document.</p>
        
        <ModalPopUp
          show={showModal}
          handleClose={handleCloseEditor}
          title="Document Editor"
          sizeElement="custom-modal-width modal-dialog-centered"
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
              <DocumentEditorContainerComponent
                id="container"
                height="570px"
                width="100%"
                serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
                enableToolbar={true} // Enable toolbar
                ref={editorContainerRef}
                className="border"
              />
            </div>
          </div>
        </div>
        </ModalPopUp>
      </AccountLayout>
    </>
  );
};

export default Editor;
