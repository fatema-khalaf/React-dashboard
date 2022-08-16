import { alpha, useTheme } from '@mui/material/styles';
import { Editor } from 'react-draft-wysiwyg';
import { Typography } from '@mui/material';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { EditorState, ContentState } from 'draft-js';
import { useEffect, useState } from 'react';
import htmlToDraft from 'html-to-draftjs';

TextEdiotor.propTypes = {
  name: PropTypes.string,
};

export function TextEdiotor({ name, initialValue, useFormRegister, ...other }) {
  // Style----------------------------------------------------------
  const theme = useTheme();
  const toolbarStyle = {
    marginBottom: '0px',
    border: 'none',
    borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.32)}`,
  };

  // Logic-----------------------------------------------------------
  const { control } = useFormContext();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    if (initialValue) {
      const contentBlock = htmlToDraft(initialValue);
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [initialValue]);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <Editor
              helperText={error?.message}
              {...field}
              editorState={editorState}
              value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
              toolbarClassName="toolbarClassName"
              toolbarStyle={toolbarStyle}
              wrapperClassName="wrapperClassName"
              wrapperStyle={{
                overflow: 'hidden',
                position: 'relative',
                borderRadius: '8px',
                borderColor: error && `${theme.palette.error.main}`,
                border: `1px solid ${theme.palette.grey[300]}`,
              }}
              editorClassName="editorClassName"
              editorStyle={{ backgroundColor: 'white', padding: ' 0px 15px', minHeight: '100px' }}
              options={('fontSize', 'fontFamily')}
              toolbar={{
                options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'history'],
                inline: { options: ['bold', 'italic', 'underline', 'strikethrough'] },
                list: { options: ['unordered', 'ordered'] },
              }}
              onEditorStateChange={onEditorStateChange}
            />
            <Typography
              variant="caption"
              mb={1}
              sx={{
                color: theme.palette.error.main,
              }}
            >
              {error?.message}{' '}
            </Typography>
          </>
        )}
      />
    </>
  );
}
