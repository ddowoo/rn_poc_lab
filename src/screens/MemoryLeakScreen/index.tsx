import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';

const leakyArray: any[] = [];

const MemoryLeakScreen = () => {
    useEffect(() => {
        const intervalId = setInterval(() => {
            const largeObject = {
                data: new Array(100000).fill({key: 'value'}),
            };
            leakyArray.push(largeObject);
            console.log('Leaky array size:', leakyArray.length);
        }, 1000);

        // 컴포넌트가 언마운트될 때 interval을 정리해야 하지만,
        // 디버깅 경험을 위해 의도적으로 주석 처리합니다.
        return () => clearInterval(intervalId);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Memory Leak Test Screen</Text>
            <Text style={styles.subText}>
                Go back and check your console/logcat.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    subText: {
        marginTop: 10,
        color: 'gray',
    },
});

export default MemoryLeakScreen;
