'use client'

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';
// import { ClassicEditor, SourceEditing } from 'ckeditor5';
import styles from './_style.module.css';

// import 'ckeditor5/ckeditor5.css';
// import 'ckeditor5-premium-features/ckeditor5-premium-features.css';

// Import ClassicEditor
// const ClassicEditor = dynamic(() => import('@ckeditor/ckeditor5-build-classic') as any, { ssr: false });
// Dynamically import the CKEditor since it's not SSR compatible
// const CKEditor = dynamic(() => import('@ckeditor/ckeditor5-react').then(mod => mod.CKEditor) as any, { ssr: false });

interface CKEditorProps {
    data?: string;
    updatedEditor: (values: any) => void;
  }

const CKEditorComponent: React.FC<CKEditorProps> = ({updatedEditor,  data}) => {
  const [editorData, setEditorData] = useState('');

  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditorData(data);
    updatedEditor(data);
  };

  const handleSave = () => {
    // Save the editor data to your backend or process it here
    console.log('Saved Content:', editorData);
  };

  return (
    <div className={`${styles.ckeditor__editable}`}>
      <CKEditor
        editor={ClassicEditor}
        data={
            '<h2>Congratulations on setting up CKEditor 5! 🎉</h2>\n<p>\n    You\'ve successfully created a CKEditor 5 project. This powerful text editor will enhance your application, enabling rich text editing\n    capabilities that are customizable and easy to use.\n</p>\n<h3>What\'s next?</h3>\n<ol>\n    <li>\n        <strong>Integrate into your app</strong>: time to bring the editing into your application. Take the code you created and add to your\n        application.\n    </li>\n    <li>\n        <strong>Explore features:</strong> Experiment with different plugins and toolbar options to discover what works best for your needs.\n    </li>\n    <li>\n        <strong>Customize your editor:</strong> Tailor the editor\'s configuration to match your application\'s style and requirements. Or even\n        write your plugin!\n    </li>\n</ol>\n<p>\n    Keep experimenting, and don\'t hesitate to push the boundaries of what you can achieve with CKEditor 5. Your feedback is invaluable to us\n    as we strive to improve and evolve. Happy editing!\n</p>\n<h3>Helpful resources</h3>\n<ul>\n    <li>📝 <a href="https://orders.ckeditor.com/trial/premium-features">Trial sign up</a>,</li>\n    <li>📕 <a href="https://ckeditor.com/docs/ckeditor5/latest/installation/index.html">Documentation</a>,</li>\n    <li>⭐️ <a href="https://github.com/ckeditor/ckeditor5">GitHub</a> (star us if you can!),</li>\n    <li>🏠 <a href="https://ckeditor.com">CKEditor Homepage</a>,</li>\n    <li>🧑‍💻 <a href="https://ckeditor.com/ckeditor-5/demo/">CKEditor 5 Demos</a>,</li>\n</ul>\n<h3>Need help?</h3>\n<p>\n    See this text, but the editor is not starting up? Check the browser\'s console for clues and guidance. It may be related to an incorrect\n    license key if you use premium features or another feature-related requirement. If you cannot make it work, file a GitHub issue, and we\n    will help as soon as possible!\n</p>\n'
        }
        onChange={handleEditorChange}
        config={{
            // plugins: [SourceEditing],
            toolbar: {
                items: [ 
                    'sourceEditing', '|',
                    'heading', '|',
                    'bold', 'italic', 'underline', 'strikethrough', '|',
                    'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
                    'alignment', '|',
                    'bulletedList', 'numberedList', 'outdent', 'indent', '|',
                    'link', 'insertTable', 'blockQuote', 'undo', 'redo', '|',
                    'imageUpload', 'mediaEmbed', 'code', 'codeBlock', '|',
                    'removeFormat', '|',
                    'file', 'pdf', 'wordExport', '|',
                ],
            },
            sourceEditing: {
                allowCollaborationFeatures: true, // Enable collaboration features
            },
            // height: '500px',
            // width: '800px',
            // licenseKey: '<YOUR_LICENSE_KEY>'
        }}
      />
    </div>
  );
};

export default CKEditorComponent;
