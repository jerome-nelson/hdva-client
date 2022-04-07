import { Context } from "aws-lambda";
import type S3 from "aws-sdk/clients/s3";
import { ERROR_MSGS } from "../../config/messages";
import { GeneralError } from "../../utils/error";
import { createErrorResponse } from "../../utils/responses";
import { convertToSlug, getProperty, getZip, retrieveArchive } from "./createZip";

jest.mock('../../config/config', () => ({
    BucketInstance: {
        getObject: (args: S3.Types.GetObjectRequest) => ({
            promise: () => new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (args.Bucket && args.Key) {
                        resolve("success");
                        return;
                    }
                    reject("Details incorrect")
                }, 0);
            })
        }),
        getSignedUrlPromise: () => Promise.resolve("/success")
    }
}));

jest.mock('../../utils/db', () => ({
    startMongoConn: () => Promise.resolve()
}));

jest.mock('../../models/media.model', () => ({
    getMedia: (id: number) => new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id > 0) {
                resolve([{ resource: "file.png" }]);
                return;
            }
            reject([])
        }, 0);
    })
}));

jest.mock('../../models/properties.model', () => ({
    getProperties: ({ pids }: { pids: number[] }) => new Promise((resolve, reject) => {
        setTimeout(() => {
            if (pids[0] > 0) {
                resolve([{ name: "Fake Property" }]);
                return;
            }
            reject([])
        }, 0);
    })
}));

describe("Unit: Creation of Zip Files", () => {
    describe("Conversion to file slug", () => {
        it("Should convert text to lowercase", () => {
            const case1 = convertToSlug("TESt");
            expect(case1).toBe("test");
        });
        it("Should replace anything that is not a word to a string", () => {
            const case1 = convertToSlug(123123123 as unknown as string);
            const case2 = convertToSlug([] as unknown as string);
            const case3 = convertToSlug([1, 2, "asdasdasd"] as unknown as string);
            expect(case1).toBe("123123123");
            expect(case2).toBe("");
            expect(case3).toBe("1-2-asdasdasd");
        });
        it("Should replace illegal characters and spaces with hyphens", () => {
            const case1 = convertToSlug("This is a property string");
            const case2 = convertToSlug(["\\", "/", ":", "*", "?", "<", ">", "|"].join("a"));
            expect(case1).toBe("this-is-a-property-string");
            expect(case2).toBe("-a-a-a-a-a-a-a-");
        });
    });
    describe("Retrieving Existing Zip Archive", () => {
        it("should return url if AWS lookup is successful", async () => {
            const case1 = await retrieveArchive("bucketName", "file-key");
            expect(case1).toEqual("/success");
        });
        it("should return empty string if error", async () => {
            const case1 = await retrieveArchive("", "");
            const case2 = await retrieveArchive("only-one", "");
            const case3 = await retrieveArchive(123123 as unknown as string, "");
            const case4 = await retrieveArchive("", "or-the-other");
            expect(case1).toEqual("");
            expect(case2).toEqual("");
            expect(case3).toEqual("");
            expect(case4).toEqual("");
        });
    });
    describe("Getting Property Details and Media", () => {
        it("should return undefined if no property data found or media files found", async () => {
            // TODO: Expand test case
            const case1 = await getProperty([0]);
            expect(case1).toBeUndefined();
        });
        it("should return media files, property details and proposed zip file name", async () => {
            // TODO: Fail individual calls to test for undefined results
            const case1 = await getProperty([1]);
            expect(case1).toEqual({"files": [{"resource": "file.png"}], "property": [{"name": "Fake Property"}], "zipname": "fake-property.zip"});
        });
    });
});

describe("CreateZip - Full Flow", () => {
    it("should return empty response if the zip buckets and image buckets are not set", async () => {
        const case1 = getZip({}, { callbackWaitsForEmptyEventLoop: false } as Context);
        expect(await case1).toEqual(createErrorResponse(new GeneralError(ERROR_MSGS.BUCKET_NOT_SET)));
    });
    it("should return empty response if there is no payload", async () => {
        process.env.highres_bucket_name = "test";
        process.env.zip_bucket_name = "test2";
        const case1 = getZip({}, { callbackWaitsForEmptyEventLoop: false } as Context);
        expect(await case1).toEqual(createErrorResponse(new Error("No results")));
    });
})