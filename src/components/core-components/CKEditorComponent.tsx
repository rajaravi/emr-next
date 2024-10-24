import React, { useEffect, useRef, useState } from 'react';
import { ClassicEditor, Essentials, Bold, Italic, Font, Paragraph, 
  Heading, SourceEditing, Alignment, Link, Table, Code, CodeBlock,
  RemoveFormat } from 'ckeditor5';
  
import dynamic from 'next/dynamic';
import styles from './_style.module.css';

// Dynamically import CKEditor to avoid server-side rendering issues
// const ClassicEditor = dynamic(() => import('../../../public/ckeditor').then(mod => mod.ClassicEditor), { ssr: false });
// const ClassicEditor = dynamic(() => import('@ckeditor/ckeditor5-build-classic'), { ssr: false });

interface CKEditorComponentProps {
  initialData: string;
  onChange: (values: any) => void;
}

const CKEditorComponent3: React.FC<CKEditorComponentProps> = React.memo(({ onChange, initialData }) => {
  const editorRef = useRef<any>(null);
  const editorInitialized = useRef(false);

  useEffect(() => {
    console.log('useEffect called');
    // import('../../../public/ckeditor').then(({ ClassicEditor }) => {
      if (typeof window !== 'undefined' && !editorInitialized.current) {
        console.log('Initializing CKEditor');
        const editorElement = document.querySelector('#editor') as HTMLElement;

        if (editorElement) {
          ClassicEditor.create(editorElement, {
            plugins: [ SourceEditing, Essentials, Bold, Italic, Font, Paragraph, Heading,
              Alignment, Link, Table, Code, CodeBlock, RemoveFormat ],
            toolbar: {
                items: [
                    'undo', 'redo', '|', 
                    'Heading', '|', 'alignment', '|',
                    'bold', 'italic', 'underline', 'strikethrough', '|',
                    'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor',
                    'bulletedList', 'numberedList', 'outdent', 'indent', '|',
                    'link', 'insertTable', 'blockQuote', 
                    'imageUpload', 'mediaEmbed', 'code', 'codeBlock', '|',
                    'removeFormat', '|',
                    'file', 'pdf', 'wordExport', '|', 'sourceEditing', '|', 
                ]
            },
            initialData,
          })
          .then((editor: any) => {
              console.log( 'CKEditor was initialized', editor );
              editorRef.current = editor;
              editorInitialized.current = true;

              editor.model.document.on('change:data', () => {
                const data = editor.getData();
                onChange(data);
              });
          })
          .catch((error: any) => {
              console.error('There was a problem initializing the editor:', error);
          });
        }
      }
    // });

    return () => {
      if (editorRef.current) {
        console.log('Destroying CKEditor...');
        editorRef.current.destroy().catch((error: any) => console.error('Error destroying the editor:', error));
        editorRef.current = null;
        editorInitialized.current = false;
      }
    };
  }, []);

  return (
      <div>
          <div id="editor" className={styles.editor} />
      </div>
  );
});

export default CKEditorComponent3;
