import React, { useState, useEffect, useRef } from 'react';
import { Platform, SafeAreaView, TouchableOpacity, View, StyleSheet, Modal, Image} from 'react-native';
import { Camera } from 'expo-camera'
import {Ionicons} from '@expo/vector-icons'
import * as Permissions from 'expo-permissions'
import * as MediaLibrary from 'expo-media-library'
import Cabecalho from './components/Cabecalho'

export default function App(){

  //Status de acesso à camera

  const [temPermissao, setTemPermissao] = useState(null)
  //Referencia da câmera
  const cameraRef = useRef(null)

  //Icone padrão que serão exibidos
  const [iconePadrao, setIconePadrao] = useState('md') //md -> Material Design

  //tipo da câmera (front ou back)
  const [tipoCamera, setTipoCamera] = useState(Camera.Constants.Type.back)

  //Status inicial do flash
  const [tipoFlash, setTipoFlash] = useState(Camera.Constants.FlashMode.off)

  //foto capturada
  const [fotoCapturada, setFotoCapturada] = useState(null)

  //Controle de exibição do Modal
  const [exibeModal, setExibeModal] = useState(false)

  useEffect(()=> {
    //Dependendo do SO, será exibido icones diferentes
    switch(Platform.OS){
      case 'android':
        setIconePadrao('md')
          break
      case 'ios':
        setIconePadrao('ios')
          break
    }
  }, [])

  useEffect(() => { //Executa o conteúdo no carregamento
    (
      async() => {
        if(Platform.OS === 'web'){
          const cameraDisponivel = await Camera.isAvailableAsync()
          setTemPermissao(cameraDisponivel)
        }else{
          const { status } = await Camera.requestPermissionsAsync() //granted
          setTemPermissao(status === 'granted')
        }
      }
    )()
  }, []) //Quando o array está vázio, executará somente uma única vez

  if(temPermissao === false){
    return <Text>Acesso negado à camera ou o seu equipamento não possui uma.</Text>
  }

  async function tirarFoto(){
    if(cameraRef) {
        const options = {
          quality: 0.5,
          skipProcessing: true
        }
      /*--->*/const foto = await cameraRef.current.takePictureAsync(options) //<---
      setFotoCapturada(foto.uri)
      setExibeModal(true)
      //console.log(foto)
    }
  }
  
  return(
    <SafeAreaView style={styles.Container}>
      <Cabecalho titulo="FateCAM"/>
      <Camera
        style={{flex: 1}}
        type={tipoCamera}
        flashMode={tipoFlash}
        ref={cameraRef}
      >
        <View style={styles.Camera}>
          <TouchableOpacity style={styles.Touch} onPress ={tirarFoto}>
            <Ionicons name={`${iconePadrao}-camera`} size = {40} color = "#9E9E9E"/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Touch} onPress={() => {
              setTipoCamera(tipoCamera === Camera.Constants.Type.back ? Camera.Constants.Type.front:
              Camera.Constants.Type.back)
          }}
          >
            <Ionicons name={`${iconePadrao}-camera-reverse`}size={40} color = "#9e9e9e"/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.Touch} onPress={() => {
              setTipoFlash(tipoFlash === Camera.Constants.FlashMode.on ? Camera.Constants.FlashMode.off:
              Camera.Constants.FlashMode.on)
          }}
          >
            <Ionicons name={tipoFlash === Camera.Constants.FlashMode.on ? `${iconePadrao}-flash` : `${iconePadrao}-flash-off`}size={40} color = "#9e9e9e"/>
          </TouchableOpacity>
        </View>
      </Camera>

      <Modal animationType="slide"
             transparent={true}
             visible={exibeModal}
      >
        <View style={styles.ModalView}>
          <Image source={{uri: fotoCapturada}}
                 style={styles.Foto}
          />
        </View>
      </Modal>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  
  Container:{
    flex: 1,
    justifyContent: 'center'
  },
  Camera:{
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  Touch:{
    margin: 20
  },
  ModalView:{
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    opacity: 0.9,
    alignItems: 'center'
  },
  Foto:{
    width: '90%', 
    height: '50%',
    borderRadius: 20
  }
})