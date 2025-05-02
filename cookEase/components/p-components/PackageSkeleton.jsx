import React from 'react';

const PackageSkeleton = () => {
  return (
    <View>
      <View style={styles.skeletonHeading} />
      <View style={styles.skeletonPackageText} />
      <View style={styles.skeletonHeading} />
      <View style={styles.textBlocksContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
          <View key={index} style={styles.skeletonTextItem} />
        ))}
      </View>
      <View style={styles.skeletonSubmitBtn} />
    </View>
  );
};

const styles = StyleSheet.create({
    skeletonHeading: {
        height: 24,
        width: "60%",
        backgroundColor: "#f0f0f0",
        borderRadius: 4,
        marginBottom: 15,
      },
      skeletonPackageText: {
        height: 150,
        width: "100%",
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        marginBottom: 20,
      },
      skeletonTextItem: {
        height: 44,
        margin: 5,
        borderRadius: 6,
        backgroundColor: "#f0f0f0",
        width: "46%",
      },
      textBlocksContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: -5,
      },
      skeletonSubmitBtn: {
        height: 50,
        width: "100%",
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        marginTop: 20,
      }
});

export default PackageSkeleton;