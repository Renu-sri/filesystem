import React, { useState } from 'react';
import initialData from '../utils/initialData';
import FileList from './FileList';

const File = () => {
  const [files, setFiles] = useState(initialData);
  const [inputValue, setInputValue] = useState('');
  const [selectedPath, setSelectedPath] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddItem = () => {
    if (inputValue.trim()) {
      const addItemRecursively = (items, path, item) => {
        return items.map((currentItem) => {
          const currentPath = `${path}/${currentItem.name}`;
          if (currentPath === selectedPath) {
            return {
              ...currentItem,
              files: currentItem.files ? [...currentItem.files, item] : [item],
            };
          } else if (currentItem.files) {
            return {
              ...currentItem,
              files: addItemRecursively(currentItem.files, currentPath, item),
            };
          }
          return currentItem;
        });
      };

      setFiles(addItemRecursively(files, '', { name: inputValue.trim() }));
      setInputValue('');
    } else {
      alert('Please enter a valid item name.');
    }
  };

  const handleToggle = (path, index) => {
    const toggleRecursively = (items, path, index) => {
      return items.map((item, idx) => {
        const currentPath = `${path}/${item.name}`;
        if (idx === index && path === selectedPath) {
          return { ...item, isOpen: !item.isOpen };
        } else if (item.files) {
          return {
            ...item,
            files: toggleRecursively(item.files, currentPath, index),
          };
        }
        return item;
      });
    };

    setFiles(toggleRecursively(files, '', index));
    setSelectedPath(path);
  };

  const handleConvert = (path, index) => {
    const convertFileOrFolder = (items, path, index) => {
      return items.map((item, idx) => {
        const currentPath = `${path}/${item.name}`;
        if (idx === index && path === selectedPath) {
          if (item.files) {
            // Convert folder to file
            return {
              ...item,
              files: null,
              isOpen: false,
            };
          } else {
            // Convert file to folder
            return {
              ...item,
              files: [],
              isOpen: true,
            };
          }
        } else if (item.files) {
          return {
            ...item,
            files: convertFileOrFolder(item.files, currentPath, index),
          };
        }
        return item;
      });
    };

    setFiles(convertFileOrFolder(files, '', index));
  };

  return (
    <div className='layout-row justify-content-between'>
      <FileList
        files={files}
        onToggle={(path, index) => handleToggle(path, index)}
        onAddItem={(path) => handleAddItem(path)}
        onConvert={(path, index) => handleConvert(path, index)}
      />
      <input
        data-testid="input-box"
        className='mt-15 mr-35 w-15'
        style={{ borderColor: "black" }}
        type="text"
        placeholder='Enter file name'
        value={inputValue}
        onChange={handleInputChange}
      />
      <button onClick={handleAddItem}>Add File</button>
    </div>
  );
};

export default File;
