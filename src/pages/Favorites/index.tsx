import React, { useState } from 'react';

import { View } from 'react-native';
import PageHeader from '../../components/PageHeader';
import { ScrollView } from 'react-native-gesture-handler';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-community/async-storage";

import styles from './styles';



function Favorites() {
    const [favorites, setFavorites] = useState([]);

    useFocusEffect(()=>{
        loadFavorites();
    })

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const favoritedTeachers = JSON.parse(response);
                setFavorites(favoritedTeachers);
            }
        });
    }

    return (
        <View style={{flex: 1,}}>
            <PageHeader title="Meus proffys favoritos" />
            <ScrollView style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                }}
            >
                {favorites.map((teacher: Teacher) => {
                    return(
                        <TeacherItem
                            key={teacher.id}
                            teacher={teacher}
                            favorited={true}
                        />
                    )
                })}

            </ScrollView>
        </View>
    )
}

export default Favorites;
