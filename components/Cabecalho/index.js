import React from 'react'
import {StyleSheet, Text, View} from 'react-native'

const Cabecalho = ({titulo}) => {
    return (
        <View>
            <Text style = {styles.Cabecalho}>{titulo}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    Cabecalho: {
        fontSize: 20,
        paddingTop: 10,
        paddingBottom: 5,
        backgroundColor: "#1A237E",
        color: "#FFFFFF",
        textAlign: 'center',
        fontWeight: 'bold'
    }
})

export default Cabecalho