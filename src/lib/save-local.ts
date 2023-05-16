import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveLocal = async (
  uuid: string,
  local_uri: string,
  processed_uri: string,
  created_at: Date,
  status: string
) => {
  const item = {
    uuid: uuid,
    local_uri: local_uri,
    processed_uri: processed_uri,
    created_at: created_at,
    status: status,
  };

  let currList = await AsyncStorage.getItem('@audio_List');
  currList = JSON.parse(currList);

  await AsyncStorage.setItem(
    '@audio_List',
    JSON.stringify({
      list: currList ? [...currList['list'], item] : [item],
    })
  );

  return item;
};
