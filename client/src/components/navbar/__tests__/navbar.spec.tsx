import { render, shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import { ThemeProvider } from 'styled-components'
import { DarkThemeContext } from '../../Providers'
import { lightTheme } from '../../themes'
import Navbar from '../navbar'

jest.mock('next/router', () => ({
    ...jest.requireActual('next/router'),
    default: {
        push: () => null
    },
    useRouter: () => ({
        pathname: ''
    })
}))

test ('should render', () => {
    const res = shallow(
        <DarkThemeContext.Provider value={false}>
            <ThemeProvider theme={lightTheme}>
                <Navbar />
            </ThemeProvider>
        </DarkThemeContext.Provider>)
    expect(toJson(res)).toMatchSnapshot()
    
})