import React from 'react';
import Button, { ButtonType, ButtonSize } from './components/Button/button';
import './styles/index.scss';

import Menu from './components/Menu/menu';
import MenuItem from './components/Menu/menuItem';
import SubMenu from './components/Menu/subMenu';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Menu defaultIndex={'0'} onSelect={(index)=>{alert(index)}} mode='vertical' defaultOpenSubMenus={['2']}>
          <MenuItem >
            cool link
          </MenuItem>
          <MenuItem  disabled>
            cool link 2
          </MenuItem>
          <SubMenu title="dropdown">
          <MenuItem>dropdown 1</MenuItem>
          <MenuItem>dropdown 2</MenuItem>
           </SubMenu>
          
          <MenuItem >
            cool link 3
          </MenuItem>
        </Menu>
     
        <Button btnType={'primary'} size={'lg'} autoFocus>
          Large Primary
        </Button>
        <Button onClick={(e)=> {e.preventDefault();alert(123)}} btnType={'danger'} size={'sm'}>
          Small Danger
        </Button>
        <Button btnType={'link'} href="http://www.baidu.com">
          Baidu Link
        </Button>
        <Button btnType={'link'}  disabled>
          Disabled Link
        </Button>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> 
    </div>
  );
}

export default App;
