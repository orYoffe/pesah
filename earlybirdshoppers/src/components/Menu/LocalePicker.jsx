import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { locales } from '../../translations'
import { setLocale } from '../../reducers/locale'
import Dropdown from '../Dropdown'

const options = locales.map(locale => ({value: locale}))

class LocalePicker extends PureComponent {
    onSelect = (e) => this.props.setLocale(e.target.value)
    render() {
        const { currentLocale } = this.props
        return (
            <Dropdown 
                defaultValue={currentLocale}
                onSelect={this.onSelect}
                options={options}
            />
        )
    }
}


const mapStateToProps = (state) => {
    return {
        currentLocale: state.locale.currentLocale,
    }
}
const mapDispatchToProps = (dispatch) => ({
    setLocale: locale => dispatch(setLocale(locale)),
})
export default connect(mapStateToProps, mapDispatchToProps)(LocalePicker)