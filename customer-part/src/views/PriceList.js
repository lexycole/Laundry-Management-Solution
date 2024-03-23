import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, Image, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { img_url, api_url, bold, normal, price_service_list, price_fare_list } from '../config/Constants';
import  Loader  from '../components/GeneralComponents';
import * as colors from '../assets/css/Colors';
import axios from 'axios';
import CardView from 'react-native-cardview';
import strings from '../languages/strings';

class PriceList extends Component<Props> {

  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        service_list:[],
        active_index:0,
        products:[],
        data:[],
        service_active_index:0
      }
  }

async componentDidMount(){
  this._unsubscribe=this.props.navigation.addListener('focus',async()=>{
    await this.service_price_list();
  });
}

componentWillUnmount(){
  this._unsubscribe();
}

service_price_list = async () => {
  this.setState({ isLoding:true})
  await axios({
    method: 'post', 
    url: api_url + price_service_list,
    data:{ lang:global.lang }

  })
  .then(async response => {
    this.setState({ isLoding:false})
      this.setState({ service_list: response.data.result })
  })
  .catch(error => {
    this.setState({ isLoding:false})
  });
}

price_list = async (id) => {
  this.change_service_index(id)
  this.setState({ isLoding:true})
  await axios({
    method: 'post', 
    url: api_url + price_fare_list,
    data:{ service_id: id, lang:global.lang }
  })
  .then(async response => {
    this.setState({ isLoding:false})
    console.log(response.data.result)
      if(response.data.result.length > 0){
        this.setState({ data:response.data.result, active_index : response.data.result[0].id, products:response.data.result[0].product  })
      }
  })
  .catch(error => {
    this.setState({ isLoding:false})
  });
}

  handleBackButtonClick= () => {
    this.props.navigation.goBack(null);
  }

  change_index = async(index,products) =>{
    this.setState({ products:[] })
    this.setState({ active_index : index, products:products });
  }

  change_service_index = async(index) =>{
    this.setState({ service_active_index : index});
  }

  render() {
    return (
        <SafeAreaView style={{ width:'100%', height:'100%', padding:10}}>
          <View>
          <ScrollView showsHorizontalScrollIndicator={false}>
            <FlatList
              data={this.state.service_list}
              horizontal={true}
              renderItem={({ item,index }) => (
                  <CardView
                  cardElevation={5}
                  style={ (this.state.service_active_index == item.id) ? styles.active_badge : styles.inactive_badge}
                  cardMaxElevation={5}
                  cornerRadius={10}>
                      <TouchableOpacity onPress={this.price_list.bind(this, item.id)} activeOpacity={1} style={{ padding:10 }}>
                          <Text style={ (this.state.service_active_index == item.id) ? styles.active_text : styles.inactive_text}>{item.service_name}</Text>
                      </TouchableOpacity>
                  </CardView>
              )}
              keyExtractor={item => item.faq_name}
            />
          </ScrollView>
          </View>
          <View style={{ margin:5 }} />
          <View>
            <ScrollView>
              <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                {this.state.data.map((row, index) => (
                  <CardView
                    cardElevation={5}
                    style={ (this.state.active_index == row.id) ? styles.active_badge : styles.inactive_badge}
                    cardMaxElevation={5}
                    cornerRadius={10}>
                    <TouchableOpacity onPress={this.change_index.bind(this,row.id,row.product)} style={{ padding:10 }}>
                        <Text style={ (this.state.active_index == row.id) ? styles.active_text : styles.inactive_text}>{row.category_name}</Text>
                    </TouchableOpacity>
                  </CardView>
                ))}
              </ScrollView>
              <FlatList
              data={this.state.products}
              renderItem={({ item,index }) => (
                <CardView
                  cardElevation={5}
                  style={{ padding:10, margin:10 }}
                  cardMaxElevation={5}
                  cornerRadius={10}>
                  <View style={{ flexDirection:'row',padding:10, width:'100%' }} >
                    <View style={{ width:'25%', alignItems:'flex-start', justifyContent:'center' }} >
                      <View style={styles.image_container} >
                        <Image
                          style= {{flex:1 , width: undefined, height: undefined}}
                          source={{uri : img_url + item.image }}
                        />
                      </View>
                    </View>
                    <View style={{ width:'45%', alignItems:'center', justifyContent:'center' }}>
                      <Text style={styles.product_name} >{item.product_name}</Text>
                    </View>
                    <View style={{ width:'30%', alignItems:'flex-end', justifyContent:'center' }}>
                      <Text style={styles.price} >{global.currency} {item.price}/</Text>
                      <Text style={styles.piece} >{strings.piese}</Text>
                    </View>
                  </View>
                </CardView>
                  
              )}
              keyExtractor={item => item.faq_name}
            />
          </ScrollView>
          </View>
          {this.state.products.length == 0 && <View style={{ alignItems:'center', justifyContent:'center', height:'100%', width:'100%' }} >
            <Text style={{ fontFamily:bold, fontSize:14 }}>{strings.choose_the_service_to_see_the_product_list}</Text>
        </View>}
        <Loader visible={this.state.isLoding} />
      </SafeAreaView>
      
    );
  }
}

export default PriceList;

const styles = StyleSheet.create({
  active_badge:{
    margin:5, 
    backgroundColor:colors.theme_bg
  },
  active_text:{
    fontSize:14, 
    fontFamily:normal, 
    color:colors.theme_fg_three
  },
  inactive_badge:{
    margin:5, 
    backgroundColor:colors.theme_bg_three
  },
  inactive_text:{
    fontSize:14, 
    fontFamily:normal, 
    color:colors.theme_fg_two
  },
  product_name:{
    fontSize:15, 
    fontFamily:bold, 
    color:colors.theme_fg,
    textAlign:'center'
  },
  price:{
    fontSize:15, 
    color:colors.theme_fg,
    fontFamily:bold
  },
  piece:{
    fontSize:12, 
    color:colors.theme_fg,
    fontFamily:bold
  },
  image_container:{
    height:50, 
    width:50
  },
});

