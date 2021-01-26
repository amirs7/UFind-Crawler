import repl from 'repl';
import {Crawler} from './Crawler';

(async () => {
    let crawler = new Crawler();
    await crawler.init();
    let shell = repl.start('Crawler> ');

    shell.on('exit', async () => {
        await crawler.stop();
        console.log('Crawler stopped');
        process.exit();
    });

    shell.defineCommand('clean', {
        help: 'Clean the Database',
        async action() {
            await crawler.cleanDatabase();
            console.log('Database cleaned');
            this.displayPrompt();
        }
    });

    shell.defineCommand('update', {
        help: 'Update the database',
        async action(semester: string) {
            if (semester)
                await crawler.updateSemester(semester);
            else
                await crawler.updateAllSemesters();
            console.log('Database updated');
            this.displayPrompt();
        }
    });

    shell.defineCommand('printAll', {
        help: 'Prints all courses',
        async action() {
            await crawler.printAllOfferings();
        }
    })
})();


