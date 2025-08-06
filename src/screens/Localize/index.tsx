import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import i18n from './i18n';

const checkNowLangOutOfComponent = () => {
    console.log(i18n.language)
}

const LocalizeScreen = () => {
    const {t, i18n} = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const nextValue = t("오른쪽");

    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>{t('안녕하세요!')}</Text>
            {/* 변수 사용 예시 */}
            <Text>{t('다음은 {{next}} 입니다.', {next: nextValue})}</Text>

            <View style={styles.buttonContainer}>
                <Text style={styles.title}>{t('언어 변경')}</Text>
                <View style={styles.button}>
                    <Button title={t('한국어')} onPress={() => changeLanguage('ko')}/>
                </View>
                <View style={styles.button}>
                    <Button title={t('영어')} onPress={() => changeLanguage('en')}/>
                </View>
                <View style={styles.button}>
                    <Button title={t('일본어')} onPress={() => changeLanguage('ja')}/>
                </View>
                <View style={styles.button}>
                    <Button title={'checkNowLangOutOfComponent'} onPress={checkNowLangOutOfComponent}/>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    title: {
        fontSize: 18,
        marginBottom: 20,
    },
    buttonContainer: {
        alignItems: 'center',
    },
    button: {
        marginVertical: 5,
        width: 200,
    },
});

export default LocalizeScreen;
