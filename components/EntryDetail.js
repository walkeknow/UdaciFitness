import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { white } from '../utils/colors'
import MetricCard from './MetricCard'
import { addEntry } from '../actions'
import { removeEntry } from '../utils/api'
import { timeToString, getDailyReminderValue } from '../utils/helpers'
import TextButton from './TextButton'

export class EntryDetail extends Component {
  componentDidMount() {
    console.log(this.props)
    const { entryId } = this.props.route.params
    const year = entryId.slice(0, 4)
    const month = entryId.slice(5, 7)
    const day = entryId.slice(8)
    this.props.navigation.setOptions({
      title: `${month}/${day}/${year}`,
    })
  }
  reset = () => {
    const { remove, goBack, entryId } = this.props

    remove()
    goBack()
    removeEntry(entryId)
  }
  render() {
    const { entryId, metrics } = this.props
    if (metrics) {
      return (
        <View style={styles.container}>
          <MetricCard metrics={metrics} date={entryId} />
          <TextButton onPress={this.reset} style={{ margin: 20 }}>
            RESET
          </TextButton>
        </View>
      )
    }
  return null
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    padding: 15,
  },
})

function mapStateToProps(state, { route }) {
  const { entryId } = route.params

  return {
    entryId,
    metrics: state[entryId],
  }
}

function mapDispatchToProps(dispatch, { navigation, route }) {
  const { entryId } = route.params

  return {
    remove: () =>
      dispatch(
        addEntry({
          [entryId]: timeToString === entryId ? getDailyReminderValue() : null,
        })
      ),
    goBack: () => navigation.goBack(),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryDetail)
