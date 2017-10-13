import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { locales } from '../../translations'
import { setLocale } from '../../reducers/locale'

class LocalePicker extends PureComponent {
    onSelect = (e) => this.props.setLocale(e.target.value)
    render() {
        const { currentLocale } = this.props
        return (
            <select onChange={this.onSelect} defaultValue={currentLocale} className="form-control">
                {locales.map(locale => (
                    <option
                    value={locale}
                    key={locale}>{locale}</option>
                ))}
            </select>
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