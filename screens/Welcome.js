import React from 'react'
import { View , StyleSheet ,Text, Button} from 'react-native'
import FormButton from '../components/FormButton';

function Welcome({navigation}) {
    return (
        <View style={styles.container}>
            <Text>Welcome</Text>
            <FormButton
              buttonTitle="Login"
              onPress={() => navigation.navigate('Login')}
            />
            <FormButton
              buttonTitle="Signup"
              onPress={() => navigation.navigate('Signup')}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    }
  });

export default Welcome
