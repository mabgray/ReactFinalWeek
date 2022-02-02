import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';
import Main from './components/MainComponent';





    class App extends Component {
       

        const store = ConfigureStore();



    render() {
        return (
            <Provider store={store}>
            <BrowserRouter>
                <div className="App">
                    <Main />
                </div>
            </BrowserRouter>
        </Provider>
        );
    }

    }
export default App;

