import React, {Component} from 'react';
import { StyleSheet, Text, FlatList, View } from 'react-native';
import { api_url, bold, normal, get_cards, delete_card } from '../config/Constants';
import * as colors from '../assets/css/Colors';
import  Loader  from '../components/GeneralComponents';
import axios from 'axios';
import { connect } from 'react-redux'; 
import { serviceActionPending, serviceActionError, serviceActionSuccess } from '../actions/FaqActions';
import strings from "../languages/strings.js";
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon, { Icons } from '../components/Icons';

class MyCards extends Component<Props> {
  constructor(props) {
      super(props)
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
      this.state = {
        result: [],
        isLoding: false
      }
  }

  handleBackButtonClick= () => {
      this.props.navigation.goBack(null);
  }

  async componentDidMount(){
  this._unsubscribe=this.props.navigation.addListener('focus',()=>{
    this.get_cards();
  });
}

componentWillUnmount(){
  this._unsubscribe();
}

  get_cards = async () => {
    this.setState({ isLoding:true })
    await axios({
      method: 'post', 
      url: api_url + get_cards,
      data:{ customer_id: global.id }
    })
    .then(async response => {
        //alert(JSON.stringify(response));
        this.setState({ result: response.data.result, isLoding:false })
    })
    .catch(error => {
      this.setState({ isLoding:false })
        alert(error);
    });
  }

  delete_cards = async (id) => {
    this.setState({ isLoding:true })
    await axios({
      method: 'post', 
      url: api_url + delete_card,
      data:{ customer_id: global.id, card_id: id }
    })
    .then(async response => {
        //alert(JSON.stringify(response));
        this.get_cards();
        this.setState({ isLoding:false })
    })
    .catch(error => {
      this.setState({ isLoding:false })
        alert(error);
    });
  }

  add_cards = async () => {
    this.props.navigation.navigate('AddCards');
  }


  render() {

    return (
      <SafeAreaView style={{ width:'100%', height:'100%'}} >
        <View androidStatusBarColor={colors.theme_bg} style={styles.header} >
          <View style={{ flex: 1, alignItems:'flex-start', justifyContent:'center' }} >
            <TouchableOpacity onPress={this.handleBackButtonClick} transparent>
              <Icon style={styles.icon} name='arrow-back' />
            </TouchableOpacity>
          </View>
          <View style={styles.header_body} >
            <Text style={styles.title} >{strings.my_cards}</Text>
          </View>
          <View style={{ alignItems:'flex-end', justifyContent:'center'}} />
        </View>
        <ScrollView >
            <FlatList
              data={this.state.result}
              renderItem={({ item,index }) => (
                <View style={{ padding:10, flexDirection:'row', width:'100%' }}>
                  <View style={{ alignItems:'flex-start', justifyContent:'center', flexDirection:'column', width:'90%'}}>
                    <Text style={styles.faq_title} >XXXX XXXX {item.last_four}</Text>
                  </View>
                  <TouchableOpacity onPress={() => this.delete_cards(item.id)} style={{ alignItems:'flex-end', justifyContent:'center', flexDirection:'column'}}>
                    <Icon type={Icons.Ionicons} name='trash' style={styles.icon} />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={item => item.question}
            />
          {this.state.result == 0 && 
          <View style={{ height:250, marginTop:'40%' }}>
           <Icon style={{color:colors.theme_button, alignSelf:'center',fontSize:100}} name='ios-card' />
          <Text style={{color:colors.theme_fg,alignSelf:'center',marginTop:30}}>{strings.Your_card_is_empty_please_add_your_card}</Text>
          </View>

        }
        
        </ScrollView>
        
        <View style={styles.footer}>
          <TouchableOpacity onPress={this.add_cards} style={styles.button}>
            <Text style={{ color:colors.theme_fg_three, fontFamily:bold, fontSize:14}}>{strings.add_card}</Text>
          </TouchableOpacity>
        </View>
         
        <Loader visible={this.state.isLoding} />
      </SafeAreaView>
    );
  }
}
 
function mapStateToProps(state){
  return{
    isLoding : state.faq.isLoding,
    error : state.faq.error,
    data : state.faq.data,
    message : state.faq.message,
    status : state.faq.status,
  };
}

const mapDispatchToProps = (dispatch) => ({
    serviceActionPending: () => dispatch(serviceActionPending()),
    serviceActionError: (error) => dispatch(serviceActionError(error)),
    serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data))
});


export default connect(mapStateToProps,mapDispatchToProps)(MyCards);

const styles = StyleSheet.create({
  header:{
    backgroundColor:colors.theme_bg
  },
  icon:{
    color:colors.theme_fg
  },
  header_body: {
    flex: 3,
    justifyContent: 'center',
    alignItems:'center'
  },
  title:{
    alignSelf:'center', 
    color:colors.theme_fg,
    alignSelf:'center', 
    fontSize:16, 
    fontFamily:bold
  },
  faq_title:{
    color:colors.theme_fg,
    fontSize:15,
    fontFamily:normal
  },
  input:{
    height:45, 
    width:'90%',
    backgroundColor:colors.theme_bg
  },
    logo:{
    alignSelf:'center',
    width:'60%',
    height:'60%',
  
  },
  icontwo:{
    height:10,
    width:12
  },
  footer:{
    backgroundColor:'transparent',
    position:'absolute',
    bottom:10,
    width:'90%',
    marginLeft:'5%',
    marginRight:'5%'
  },
  button: {
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:colors.theme_bg,
    height:45,
  },
});
