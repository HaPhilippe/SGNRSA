import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from "./store"
import Header from './components/app/Header.jsx'
import Footer from './components/app/Footer.jsx'
// import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Header />
                <App />
                <Footer/>
            </BrowserRouter>
        </Provider>
       
    </React.StrictMode>,
)