import React, { useState } from 'react';

import { View, Text } from 'react-native';
import { ScrollView, TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import AsyncStorage from "@react-native-community/async-storage";

import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';

import { Feather } from "@expo/vector-icons";

import api from '../../services/api';

import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';


function TeacherList() {
    
    const [favorites, setFavorites] = useState<number[]>([]);
    const [teachers, setTeachers] = useState([]);
    const [subject, setSubject]= useState('');
    const [week_day, setWeekDay]= useState('');
    const [time, setTime]= useState('');
    
    const [isfiltersVisible, setIsFiltersVisible] = useState(false);
    
    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response) {
                const favoritedTeachers = JSON.parse(response);
                const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
                    return teacher.id
                });
                setFavorites(favoritedTeachersIds);
            }
        });
    }
    
    useFocusEffect(()=>{
        loadFavorites();
    });

    async function handleFilterSubmit() {
        loadFavorites();
        const response = await api.get('/classes', {
            params: {
                subject,
                week_day,
                time
            }
        });
        setIsFiltersVisible(false);
        setTeachers(response.data);  
    }

    function handleToogleFiltersVisible() {
        setIsFiltersVisible(!isfiltersVisible);
    }

    return (
        <View style={styles.container}>
            <PageHeader 
                title="Proffys Disponíveis" 
                headerRight={(
                    <BorderlessButton onPress={handleToogleFiltersVisible}>
                        <Feather 
                            name="filter"
                            size={25}
                            color="#fff"
                        />
                    </BorderlessButton>
                )}
            >
                { isfiltersVisible && ( 
                    <View style={styles.searchForm}>
                        <Text style={styles.label}>
                            Matéria
                        </Text>
                        <TextInput
                            style={styles.input}    
                            placeholder="Qual a matéria?"
                            placeholderTextColor="#c1bccc"
                            value={subject}
                            onChangeText={ text => setSubject(text)}
                        />   
                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>
                                    Dia da Semana
                                </Text>
                                <TextInput
                                    style={styles.input}    
                                    placeholder="Qual o dia?"
                                    placeholderTextColor="#c1bccc"
                                    value={week_day}
                                    onChangeText={ text => setWeekDay(text)}
                                /> 
                            </View>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>
                                    Horário
                                </Text>
                                <TextInput
                                    style={styles.input}    
                                    placeholder="Qual horário?"
                                    placeholderTextColor="#c1bccc"
                                    value={time}
                                    onChangeText={ text => setTime(text)}
                                /> 
                            </View>
                        </View>
                        <RectButton 
                            style={styles.submitButton}
                            onPress={handleFilterSubmit}
                        >
                            <Text style={styles.submitButtonText}>
                                Filtrar
                            </Text>
                        </RectButton>
                    </View>
                )}
            </PageHeader>
            <ScrollView style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16,
                }}
                >
                {teachers.map((teacher: Teacher) => {
                    return (
                    <TeacherItem 
                        key={teacher.id}
                        teacher={teacher}
                        favorited={favorites.includes(teacher.id)}
                    />
                    )
                })}

            </ScrollView>
        </View>
    )
}

export default TeacherList;
